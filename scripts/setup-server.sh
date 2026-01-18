#!/bin/bash

# Voyaro Server Setup Script
# Run this on a fresh Ubuntu 22.04 server

set -e

echo "=========================================="
echo "Voyaro Server Setup Script"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)"
    exit 1
fi

# Update system
log_info "Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
log_info "Installing essential packages..."
apt install -y curl wget git build-essential software-properties-common

# Install Node.js 20
log_info "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install PM2 globally
log_info "Installing PM2..."
npm install -g pm2

# Install PostgreSQL
log_info "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Install Nginx
log_info "Installing Nginx..."
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Install Certbot for SSL
log_info "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Create deploy user
log_info "Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx" >> /etc/sudoers
fi

# Create project directory
log_info "Creating project directory..."
mkdir -p /var/www/voyaro
chown -R deploy:deploy /var/www/voyaro

# Create logs directory
mkdir -p /var/www/voyaro/logs
chown -R deploy:deploy /var/www/voyaro/logs

# Configure firewall
log_info "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Setup PostgreSQL database
log_info "Setting up PostgreSQL database..."
read -p "Enter database password: " DB_PASSWORD
sudo -u postgres psql << EOF
CREATE USER voyaro WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE voyaro OWNER voyaro;
GRANT ALL PRIVILEGES ON DATABASE voyaro TO voyaro;
EOF

# Create environment file
log_info "Creating environment file template..."
cat > /var/www/voyaro/.env << EOF
# Database
DATABASE_URL=postgresql://voyaro:$DB_PASSWORD@localhost:5432/voyaro?schema=public

# JWT - Generate a secure secret: openssl rand -base64 32
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_SECRET
JWT_EXPIRATION=24h

# Stripe - Get from Stripe Dashboard
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx

# URLs
FRONTEND_URL=https://voyaro.com
API_URL=https://api.voyaro.com/api
NEXT_PUBLIC_API_URL=https://api.voyaro.com/api

# Node environment
NODE_ENV=production
EOF

chown deploy:deploy /var/www/voyaro/.env
chmod 600 /var/www/voyaro/.env

# Setup PM2 startup
log_info "Configuring PM2 startup..."
pm2 startup systemd -u deploy --hp /home/deploy

echo ""
echo "=========================================="
echo "Server setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Switch to deploy user: su - deploy"
echo "2. Clone your repository to /var/www/voyaro"
echo "3. Edit /var/www/voyaro/.env with your secrets"
echo "4. Copy nginx/voyaro.conf to /etc/nginx/sites-available/"
echo "5. Enable the site: ln -s /etc/nginx/sites-available/voyaro.conf /etc/nginx/sites-enabled/"
echo "6. Remove default site: rm /etc/nginx/sites-enabled/default"
echo "7. Test nginx: nginx -t"
echo "8. Setup SSL: certbot --nginx -d voyaro.com -d www.voyaro.com -d api.voyaro.com"
echo "9. Run deployment: ./scripts/deploy.sh all"
echo ""
