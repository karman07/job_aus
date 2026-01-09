#!/bin/bash

# AWS EC2 Deployment Script for CrossNations Backend

echo "🚀 Starting CrossNations Backend Deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository (replace with your repo URL)
git clone https://github.com/your-username/crossnations-backend.git
cd crossnations-backend/backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Create production environment file
cat > .env << EOF
PORT=3001
MONGODB_URI=mongodb://localhost:27017/crossnations_backend
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
EOF

# Install and start MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create uploads directory
mkdir -p uploads

# Start application with PM2
pm2 start dist/server.js --name "crossnations-backend"
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/crossnations << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/crossnations /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment completed!"
echo "🌐 API available at: http://your-domain.com"
echo "📊 Monitor with: pm2 monit"