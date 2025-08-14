#!/bin/bash

# POS System Infrastructure Startup Script

set -e

echo "🚀 Starting POS System Infrastructure..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to check if ports are available
check_ports() {
    local ports=("27017" "6379" "80" "9090" "3000" "8081" "8082")
    
    for port in "${ports[@]}"; do
        if netstat -tuln | grep ":$port " > /dev/null; then
            echo "⚠️  Port $port is already in use. Please stop the service using this port."
        fi
    done
}

# Function to start services
start_services() {
    echo "📦 Starting services..."
    
    # Start core services first
    echo "🔧 Starting core services (MongoDB, Redis)..."
    docker-compose up -d mongodb redis
    
    # Wait for databases to be ready
    echo "⏳ Waiting for databases to be ready..."
    sleep 10
    
    # Start monitoring services
    echo "📊 Starting monitoring services..."
    docker-compose up -d prometheus grafana node-exporter mongodb-exporter redis-exporter
    
    # Start web interfaces
    echo "🌐 Starting web interfaces..."
    docker-compose up -d mongo-express redis-commander
    
    # Start nginx last
    echo "🔄 Starting Nginx reverse proxy..."
    docker-compose up -d nginx
    
    echo "✅ All services started successfully!"
}

# Function to show status
show_status() {
    echo "📋 Service Status:"
    docker-compose ps
    
    echo ""
    echo "🌐 Access URLs:"
    echo "  Main App:        http://main.pos.local"
    echo "  Restaurant App:  http://restaurant.pos.local"
    echo "  Retail App:      http://retail.pos.local"
    echo "  API Server:      http://api.pos.local"
    echo "  Admin API:       http://admin.pos.local"
    echo "  Monitoring:      http://monitor.pos.local"
    echo "  MongoDB UI:      http://mongo.pos.local"
    echo "  Redis UI:        http://redis.pos.local"
    echo ""
    echo "🔑 Default Credentials:"
    echo "  MongoDB:         admin / pos_password_2024"
    echo "  Grafana:         admin / pos_password_2024"
    echo "  Mongo Express:   admin / pos_password_2024"
    echo "  Redis Commander: admin / pos_password_2024"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping all services..."
    docker-compose down
    echo "✅ All services stopped"
}

# Function to restart services
restart_services() {
    echo "🔄 Restarting services..."
    stop_services
    start_services
    show_status
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        echo "📋 Showing all logs (Ctrl+C to exit)..."
        docker-compose logs -f
    else
        echo "📋 Showing logs for $1 (Ctrl+C to exit)..."
        docker-compose logs -f "$1"
    fi
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Cleanup completed"
}

# Main script logic
case "${1:-start}" in
    "start")
        check_docker
        check_ports
        start_services
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        check_docker
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start     Start all services (default)"
        echo "  stop      Stop all services"
        echo "  restart   Restart all services"
        echo "  status    Show service status and access URLs"
        echo "  logs      Show logs (all services or specific service)"
        echo "  cleanup   Stop services and clean up volumes"
        echo "  help      Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 logs mongodb"
        echo "  $0 status"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac 