#!/bin/bash

# Voyaro Database Backup Script
# Run via cron: 0 2 * * * /var/www/voyaro/scripts/backup-db.sh

set -e

BACKUP_DIR="/var/www/voyaro/backups"
DB_NAME="voyaro"
DB_USER="voyaro"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "[$(date)] Starting backup..."
pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

# Verify backup
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "[$(date)] Backup created: $BACKUP_FILE"
    echo "[$(date)] Size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "[$(date)] ERROR: Backup failed!"
    exit 1
fi

# Remove old backups
echo "[$(date)] Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Backup completed successfully"
