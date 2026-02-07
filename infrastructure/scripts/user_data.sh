#!/bin/bash
set -e

# Update system
dnf update -y

# Install dependencies
dnf install -y git nginx python3.12 python3.12-pip

# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/ec2-user/.bashrc

# Install Certbot
dnf install -y certbot python3-certbot-nginx

# Create application directory
mkdir -p /opt/ownvsrent
chown ec2-user:ec2-user /opt/ownvsrent

# Create systemd service for the app
cat > /etc/systemd/system/ownvsrent.service << 'SERVICEEOF'
[Unit]
Description=ownvsrent FastAPI Application
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/opt/ownvsrent/backend
Environment="PATH=/home/ec2-user/.local/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/home/ec2-user/.local/bin/uv run uvicorn ownvsrent.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Create initial Nginx config (will be updated by Certbot)
cat > /etc/nginx/conf.d/ownvsrent.conf << 'NGINXEOF'
server {
    listen 80;
    server_name api.ownvsrent.io;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

# Start Nginx
systemctl enable nginx
systemctl start nginx

# Reload systemd
systemctl daemon-reload

echo "User data script completed successfully"
