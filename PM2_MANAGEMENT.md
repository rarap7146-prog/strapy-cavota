# Cavota Project - PM2 Management Guide

This guide covers the unified PM2 setup for managing both Strapi backend and Next.js frontend applications.

## 🚀 Quick Start

```bash
# Start both applications
./pm2-cavota.sh start

# Check status
./pm2-cavota.sh status

# View logs
./pm2-cavota.sh logs

# Stop applications
./pm2-cavota.sh stop
```

## 📁 Configuration Files

- `ecosystem.config.json` - Development environment
- `ecosystem.production.json` - Production environment
- `pm2-cavota.sh` - Management script

## 🔧 PM2 Management Commands

### Basic Operations
```bash
# Start applications
./pm2-cavota.sh start

# Stop applications
./pm2-cavota.sh stop

# Restart applications
./pm2-cavota.sh restart

# Zero-downtime reload
./pm2-cavota.sh reload

# Check status
./pm2-cavota.sh status
```

### Logging & Monitoring
```bash
# View all logs
./pm2-cavota.sh logs

# View Strapi logs only
./pm2-cavota.sh logs-strapi

# View Frontend logs only
./pm2-cavota.sh logs-frontend

# Open monitoring interface
./pm2-cavota.sh monitor
```

### System Management
```bash
# Save current process list
./pm2-cavota.sh save

# Setup startup script
./pm2-cavota.sh startup

# Remove from PM2
./pm2-cavota.sh delete
```

## 🏗️ Application Architecture

### Development Setup
- **Strapi Backend**: Port 1337 (cavota-strapi)
- **Next.js Frontend**: Port 3000 (cavota-frontend)

### Production Setup
- **Strapi Backend**: Port 1337 (cavota-strapi-prod)
- **Next.js Frontend**: Port 3000 (cavota-frontend-prod)

## 📊 Process Information

| Application | Process Name | Port | Memory Limit | Environment |
|-------------|--------------|------|--------------|-------------|
| Strapi Dev | cavota-strapi | 1337 | 1GB | development |
| Frontend Dev | cavota-frontend | 3000 | 512MB | development |
| Strapi Prod | cavota-strapi-prod | 1337 | 1GB | production |
| Frontend Prod | cavota-frontend-prod | 3000 | 512MB | production |

## 🔄 Environment Switching

### Development
```bash
pm2 start ecosystem.config.json
```

### Production
```bash
# Build applications first
cd /var/www/linkgacor.one
npm run build
cd frontend
npm run build

# Start production processes
pm2 start ecosystem.production.json --env production
```

## 📋 Log Locations

All logs are stored in `/var/log/pm2/` with the following structure:

```
/var/log/pm2/
├── cavota-strapi.log          # Combined Strapi logs
├── cavota-strapi-out.log      # Strapi stdout
├── cavota-strapi-error.log    # Strapi stderr
├── cavota-frontend.log        # Combined Frontend logs
├── cavota-frontend-out.log    # Frontend stdout
└── cavota-frontend-error.log  # Frontend stderr
```

## 🛠️ Troubleshooting

### Check Process Status
```bash
pm2 status
```

### View Real-time Logs
```bash
pm2 logs cavota-strapi --lines 100
pm2 logs cavota-frontend --lines 100
```

### Restart Specific Application
```bash
pm2 restart cavota-strapi
pm2 restart cavota-frontend
```

### Memory Issues
```bash
# Check memory usage
pm2 monit

# Restart if memory limit exceeded
pm2 restart cavota-strapi
```

### Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :1337
netstat -tulpn | grep :3000

# Kill processes if needed
pm2 stop cavota-strapi
pm2 stop cavota-frontend
```

## 🔧 Advanced Configuration

### Custom Environment Variables
Edit the ecosystem files to add custom environment variables:

```json
{
  "env": {
    "NODE_ENV": "development",
    "DATABASE_URL": "your_database_url",
    "STRAPI_API_TOKEN": "your_api_token"
  }
}
```

### Scaling (Production)
```json
{
  "instances": 2,
  "exec_mode": "cluster"
}
```

### Auto-restart Configuration
```json
{
  "max_restarts": 3,
  "min_uptime": "10s",
  "max_memory_restart": "1G"
}
```

## 🚀 Startup Configuration

To ensure PM2 starts on system boot:

1. Setup startup script:
   ```bash
   ./pm2-cavota.sh startup
   ```

2. Follow the displayed instructions (usually something like):
   ```bash
   sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u root --hp /root
   ```

3. Save current process list:
   ```bash
   ./pm2-cavota.sh save
   ```

## 📈 Monitoring & Maintenance

### Health Checks
```bash
# Quick health check
curl http://localhost:1337/admin
curl http://localhost:3000

# PM2 process monitoring
pm2 monit
```

### Performance Monitoring
```bash
# View process metrics
pm2 show cavota-strapi
pm2 show cavota-frontend

# Real-time monitoring
pm2 monit
```

### Log Rotation
PM2 includes automatic log rotation. To configure:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🔒 Security Considerations

1. **Log Permissions**: Ensure log files have appropriate permissions
2. **Process User**: Run PM2 processes with appropriate user privileges
3. **Environment Variables**: Keep sensitive data in environment files
4. **Network Access**: Configure firewall rules for ports 1337 and 3000

## 🆘 Emergency Procedures

### Complete System Restart
```bash
# Stop all processes
./pm2-cavota.sh stop

# Clear PM2 cache
pm2 kill

# Restart
./pm2-cavota.sh start
```

### Database Connection Issues
```bash
# Check Strapi logs
./pm2-cavota.sh logs-strapi

# Restart Strapi only
pm2 restart cavota-strapi
```

### Frontend Build Issues
```bash
# Rebuild frontend
cd /var/www/linkgacor.one/frontend
npm run build

# Restart frontend
pm2 restart cavota-frontend
```

---

For additional help, check PM2 documentation: https://pm2.keymetrics.io/docs/