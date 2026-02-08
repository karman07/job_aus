# PM2 Deployment Guide

## Install PM2
```bash
npm install -g pm2
```

## Build Project
```bash
npm run build
```

## Start Application
```bash
pm2 start dist/server.js --name crossnations-backend
```

## Common Commands
```bash
# Stop
pm2 stop crossnations-backend

# Restart
pm2 restart crossnations-backend

# Delete
pm2 delete crossnations-backend

# View logs
pm2 logs crossnations-backend

# Monitor
pm2 monit

# Status
pm2 status
```

## Auto-Start on Reboot
```bash
pm2 startup
pm2 save
```

## Quick Redeploy
```bash
npm run build && pm2 restart crossnations-backend
```
