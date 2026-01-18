# Voyaro Deployment Guide

This guide covers deploying Voyaro to a DigitalOcean Droplet with PostgreSQL, Nginx, and PM2.

## Prerequisites

- A DigitalOcean account
- A domain name (e.g., voyaro.com) with DNS configured
- Stripe account with API keys

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────┐
│                    DigitalOcean Droplet                  │
│                     (Ubuntu 22.04)                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │                    Nginx                         │    │
│  │         (Reverse Proxy + SSL Termination)        │    │
│  └──────────┬────────────────────┬─────────────────┘    │
│             │                    │                       │
│             ▼                    ▼                       │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │   voyaro.com     │  │  api.voyaro.com  │            │
│  │   (Next.js)      │  │   (NestJS)       │            │
│  │   Port 3000      │  │   Port 4000      │            │
│  └──────────────────┘  └──────────────────┘            │
│             │                    │                       │
│             └────────────┬───────┘                       │
│                          ▼                               │
│              ┌──────────────────┐                       │
│              │   PostgreSQL     │                       │
│              │   Port 5432      │                       │
│              └──────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## Step 1: Create Droplet

1. Log into DigitalOcean and create a new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic, 2GB RAM / 1 vCPU ($12/month) minimum
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended)

2. Note the Droplet's IP address.

## Step 2: Configure DNS

Add these DNS records for your domain:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_DROPLET_IP |
| A | www | YOUR_DROPLET_IP |
| A | api | YOUR_DROPLET_IP |

## Step 3: Initial Server Setup

SSH into your server:

```bash
ssh root@YOUR_DROPLET_IP
```

Run the setup script:

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/yourusername/voyaro/main/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

Or manually install dependencies:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install Certbot
apt install -y certbot python3-certbot-nginx

# Configure firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## Step 4: Setup PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER voyaro WITH PASSWORD 'your_secure_password';
CREATE DATABASE voyaro OWNER voyaro;
GRANT ALL PRIVILEGES ON DATABASE voyaro TO voyaro;
\q
```

## Step 5: Create Deploy User

```bash
# Create user
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy

# Setup SSH keys for deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Create project directory
mkdir -p /var/www/voyaro
chown -R deploy:deploy /var/www/voyaro
```

## Step 6: Clone Repository

Switch to deploy user and clone:

```bash
su - deploy
cd /var/www/voyaro
git clone https://github.com/yourusername/voyaro.git .
```

## Step 7: Configure Environment

Create the environment file:

```bash
cp .env.example .env
nano .env
```

Update with your values:

```env
# Database
DATABASE_URL=postgresql://voyaro:your_password@localhost:5432/voyaro?schema=public

# JWT - Generate with: openssl rand -base64 32
JWT_SECRET=your_generated_secret_here
JWT_EXPIRATION=24h

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_PRICE_ID=price_xxxxx

# URLs
FRONTEND_URL=https://voyaro.com
API_URL=https://api.voyaro.com/api
NEXT_PUBLIC_API_URL=https://api.voyaro.com/api

NODE_ENV=production
```

## Step 8: Configure Nginx

```bash
# Copy configuration
sudo cp /var/www/voyaro/nginx/voyaro.conf /etc/nginx/sites-available/

# Enable site
sudo ln -s /etc/nginx/sites-available/voyaro.conf /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 9: Setup SSL with Certbot

```bash
sudo certbot --nginx -d voyaro.com -d www.voyaro.com -d api.voyaro.com
```

Follow the prompts to complete SSL setup. Certbot will automatically configure Nginx.

## Step 10: Deploy Application

Run the deployment script:

```bash
cd /var/www/voyaro
chmod +x scripts/deploy.sh
./scripts/deploy.sh all
```

Or deploy manually:

```bash
# API
cd /var/www/voyaro/voyaro-api
npm ci --only=production
npx prisma generate
npx prisma migrate deploy
npm run build

# Web
cd /var/www/voyaro/voyaro-web
npm ci
npm run build

# Start with PM2
cd /var/www/voyaro
pm2 start ecosystem.config.js --env production
pm2 save
```

## Step 11: Setup PM2 Startup

```bash
pm2 startup systemd -u deploy --hp /home/deploy
# Run the command it outputs
pm2 save
```

## Step 12: Seed Database (Optional)

```bash
cd /var/www/voyaro/voyaro-api
npx prisma db seed
```

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.voyaro.com/api/subscriptions/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the signing secret to your `.env` as `STRIPE_WEBHOOK_SECRET`

## Maintenance

### View Logs

```bash
pm2 logs voyaro-api
pm2 logs voyaro-web
pm2 logs --lines 100
```

### Restart Services

```bash
pm2 restart voyaro-api
pm2 restart voyaro-web
pm2 restart all
```

### Update Application

```bash
cd /var/www/voyaro
./scripts/deploy.sh all
```

### Database Backup

```bash
# Manual backup
./scripts/backup-db.sh

# Setup automated daily backups
crontab -e
# Add: 0 2 * * * /var/www/voyaro/scripts/backup-db.sh
```

### Monitor Resources

```bash
pm2 monit
htop
df -h
```

## Docker Deployment (Alternative)

If you prefer Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Troubleshooting

### API not starting

```bash
# Check logs
pm2 logs voyaro-api --lines 50

# Verify environment
cd /var/www/voyaro/voyaro-api
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npx prisma db push --dry-run
```

### Nginx errors

```bash
# Test config
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL issues

```bash
# Renew certificates
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

### Database issues

```bash
# Connect to database
psql -U voyaro -d voyaro

# Check migrations
cd /var/www/voyaro/voyaro-api
npx prisma migrate status
```

## Security Checklist

- [ ] SSH key authentication only (disable password auth)
- [ ] Firewall configured (UFW)
- [ ] SSL certificates installed
- [ ] Environment variables secured (chmod 600)
- [ ] Regular backups configured
- [ ] Fail2ban installed (optional)
- [ ] Automatic security updates enabled

## Performance Optimization

1. **Enable Nginx caching** for static assets
2. **Use PM2 cluster mode** for API (already configured)
3. **Enable PostgreSQL connection pooling** with PgBouncer for high traffic
4. **Add Redis** for session storage and caching
5. **Use CDN** (Cloudflare) for static assets

## Scaling

For higher traffic:

1. Upgrade Droplet size
2. Separate database to managed PostgreSQL
3. Add load balancer
4. Use multiple application servers
5. Implement Redis for caching
