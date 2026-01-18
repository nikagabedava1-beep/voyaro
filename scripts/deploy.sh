#!/bin/bash

# Voyaro Deployment Script
# Usage: ./scripts/deploy.sh [api|web|all]

set -e

DEPLOY_TARGET=${1:-all}
PROJECT_DIR="/var/www/voyaro"

echo "=========================================="
echo "Voyaro Deployment Script"
echo "Target: $DEPLOY_TARGET"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as correct user
check_user() {
    if [ "$EUID" -eq 0 ]; then
        log_error "Do not run this script as root. Use a deploy user."
        exit 1
    fi
}

# Pull latest code
pull_code() {
    log_info "Pulling latest code from repository..."
    cd "$PROJECT_DIR"
    git fetch origin
    git reset --hard origin/main
    log_info "Code updated successfully"
}

# Deploy API
deploy_api() {
    log_info "Deploying API..."
    cd "$PROJECT_DIR/voyaro-api"

    # Install dependencies
    log_info "Installing API dependencies..."
    npm ci --only=production

    # Generate Prisma client
    log_info "Generating Prisma client..."
    npx prisma generate

    # Run migrations
    log_info "Running database migrations..."
    npx prisma migrate deploy

    # Build the application
    log_info "Building API..."
    npm run build

    # Restart PM2 process
    log_info "Restarting API process..."
    pm2 restart voyaro-api --update-env || pm2 start ecosystem.config.js --only voyaro-api --env production

    log_info "API deployed successfully"
}

# Deploy Web
deploy_web() {
    log_info "Deploying Web..."
    cd "$PROJECT_DIR/voyaro-web"

    # Install dependencies
    log_info "Installing Web dependencies..."
    npm ci

    # Build the application
    log_info "Building Web..."
    npm run build

    # Restart PM2 process
    log_info "Restarting Web process..."
    pm2 restart voyaro-web --update-env || pm2 start ecosystem.config.js --only voyaro-web --env production

    log_info "Web deployed successfully"
}

# Save PM2 configuration
save_pm2() {
    log_info "Saving PM2 configuration..."
    pm2 save
}

# Main deployment logic
main() {
    check_user
    pull_code

    case $DEPLOY_TARGET in
        api)
            deploy_api
            ;;
        web)
            deploy_web
            ;;
        all)
            deploy_api
            deploy_web
            ;;
        *)
            log_error "Invalid target: $DEPLOY_TARGET"
            echo "Usage: ./deploy.sh [api|web|all]"
            exit 1
            ;;
    esac

    save_pm2

    echo ""
    echo "=========================================="
    log_info "Deployment completed successfully!"
    echo "=========================================="
    pm2 status
}

main
