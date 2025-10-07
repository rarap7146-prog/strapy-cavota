#!/bin/bash

# PM2 Management Script for Cavota Project
# Usage: ./pm2-cavota.sh [start|stop|restart|status|logs|monitor]

PROJECT_DIR="/var/www/linkgacor.one"
ECOSYSTEM_CONFIG="$PROJECT_DIR/ecosystem.config.json"

case "$1" in
    "start")
        echo "🚀 Starting Cavota applications..."
        cd $PROJECT_DIR
        pm2 start $ECOSYSTEM_CONFIG
        echo "✅ Applications started successfully!"
        pm2 status
        ;;
    
    "stop")
        echo "🛑 Stopping Cavota applications..."
        pm2 stop cavota-strapi cavota-frontend
        echo "✅ Applications stopped successfully!"
        ;;
    
    "restart")
        echo "🔄 Restarting Cavota applications..."
        pm2 restart cavota-strapi cavota-frontend
        echo "✅ Applications restarted successfully!"
        ;;
    
    "reload")
        echo "🔄 Reloading Cavota applications (zero-downtime)..."
        pm2 reload cavota-strapi cavota-frontend
        echo "✅ Applications reloaded successfully!"
        ;;
    
    "status")
        echo "📊 Cavota applications status:"
        pm2 status cavota-strapi cavota-frontend
        ;;
    
    "logs")
        echo "📋 Showing logs for Cavota applications..."
        pm2 logs cavota-strapi cavota-frontend
        ;;
    
    "logs-strapi")
        echo "📋 Showing Strapi logs..."
        pm2 logs cavota-strapi
        ;;
    
    "logs-frontend")
        echo "📋 Showing Frontend logs..."
        pm2 logs cavota-frontend
        ;;
    
    "monitor")
        echo "📈 Opening PM2 monitor..."
        pm2 monit
        ;;
    
    "delete")
        echo "🗑️ Deleting Cavota applications from PM2..."
        pm2 delete cavota-strapi cavota-frontend
        echo "✅ Applications deleted successfully!"
        ;;
    
    "save")
        echo "💾 Saving PM2 process list..."
        pm2 save
        echo "✅ Process list saved!"
        ;;
    
    "startup")
        echo "⚙️ Setting up PM2 startup script..."
        pm2 startup
        echo "✅ Follow the instructions above to complete startup setup!"
        ;;
    
    *)
        echo "🔧 Cavota PM2 Management Script"
        echo ""
        echo "Usage: $0 {start|stop|restart|reload|status|logs|logs-strapi|logs-frontend|monitor|delete|save|startup}"
        echo ""
        echo "Commands:"
        echo "  start       - Start both Strapi and Frontend applications"
        echo "  stop        - Stop both applications"
        echo "  restart     - Restart both applications"
        echo "  reload      - Zero-downtime reload of both applications"
        echo "  status      - Show status of both applications"
        echo "  logs        - Show logs for both applications"
        echo "  logs-strapi - Show Strapi logs only"
        echo "  logs-frontend - Show Frontend logs only"
        echo "  monitor     - Open PM2 monitoring interface"
        echo "  delete      - Remove applications from PM2"
        echo "  save        - Save current PM2 process list"
        echo "  startup     - Setup PM2 to start on system boot"
        echo ""
        exit 1
        ;;
esac