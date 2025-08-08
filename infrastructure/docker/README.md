# POS System Infrastructure

This directory contains the complete infrastructure setup for the multi-domain POS system using Docker Compose.

## Services Overview

### Core Services
- **MongoDB**: Primary database with authentication and optimized configuration
- **Redis**: Caching and session management
- **Nginx**: Reverse proxy with multi-domain routing and load balancing

### Monitoring Stack
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Dashboards and visualization
- **Node Exporter**: System metrics
- **MongoDB Exporter**: Database metrics
- **Redis Exporter**: Cache metrics

### Management UIs
- **Mongo Express**: MongoDB web interface
- **Redis Commander**: Redis web interface

## Quick Start

### 1. Start All Services
```bash
cd infrastructure/docker
docker-compose up -d
```

### 2. Start Specific Services
```bash
# Start only database services
docker-compose up -d mongodb redis

# Start only monitoring services
docker-compose up -d prometheus grafana node-exporter

# Start only web interfaces
docker-compose up -d mongo-express redis-commander
```

### 3. View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f mongodb
docker-compose logs -f nginx
```

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| MongoDB | 27017 | Database |
| Redis | 6379 | Cache |
| Nginx | 80, 443 | Reverse Proxy |
| Prometheus | 9090 | Metrics |
| Grafana | 3000 | Dashboards |
| Node Exporter | 9100 | System Metrics |
| MongoDB Exporter | 9216 | DB Metrics |
| Redis Exporter | 9121 | Cache Metrics |
| Mongo Express | 8081 | MongoDB UI |
| Redis Commander | 8082 | Redis UI |

## Domain Configuration

The Nginx configuration provides multi-domain routing:

| Domain | Target | Description |
|--------|--------|-------------|
| `main.pos.local` | Port 3000 | Main web app (account & billing) |
| `restaurant.pos.local` | Port 3001 | Restaurant web app |
| `retail.pos.local` | Port 3002 | Retail web app |
| `api.pos.local` | Port 4001 | API server |
| `admin.pos.local` | Port 4002 | Admin API server |
| `monitor.pos.local` | Port 3000 | Grafana dashboards |
| `mongo.pos.local` | Port 8081 | MongoDB Express UI |
| `redis.pos.local` | Port 8082 | Redis Commander UI |

## Environment Variables

### MongoDB
- `MONGO_INITDB_ROOT_USERNAME`: admin
- `MONGO_INITDB_ROOT_PASSWORD`: pos_password_2024
- `MONGO_INITDB_DATABASE`: pos_system

### Redis
- No authentication by default (configured in redis.conf)

### Grafana
- `GF_SECURITY_ADMIN_USER`: admin
- `GF_SECURITY_ADMIN_PASSWORD`: pos_password_2024

## Monitoring Setup

### Prometheus Targets
- System metrics (Node Exporter)
- Database metrics (MongoDB Exporter)
- Cache metrics (Redis Exporter)
- Application health checks

### Grafana Dashboards
- System overview
- Database performance
- Application metrics
- Custom POS-specific dashboards

### Alerting Rules
- High CPU/Memory/Disk usage
- Service availability
- Response time thresholds
- Error rate monitoring

## Security Considerations

### MongoDB
- Authentication enabled
- Separate users for app and monitoring
- Network isolation via Docker networks

### Redis
- Memory limits configured
- No external authentication (internal network only)

### Nginx
- Rate limiting configured
- Security headers enabled
- SSL ready (certificates to be added)

## Data Persistence

All data is persisted using Docker volumes:

- `mongodb_data`: MongoDB database files
- `redis_data`: Redis database files
- `prometheus_data`: Prometheus metrics storage
- `grafana_data`: Grafana dashboards and settings
- `nginx_logs`: Nginx access and error logs

## Backup and Recovery

### MongoDB Backup
```bash
# Create backup
docker exec pos-mongodb mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Restore backup
docker exec -i pos-mongodb mongorestore /backup/backup_name
```

### Redis Backup
```bash
# Redis automatically creates snapshots
# Manual backup
docker exec pos-redis redis-cli BGSAVE
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using a port
   netstat -tulpn | grep :27017
   ```

2. **Service Not Starting**
   ```bash
   # Check service logs
   docker-compose logs service_name
   
   # Check service status
   docker-compose ps
   ```

3. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   docker exec -it pos-mongodb mongosh --eval "db.adminCommand('ping')"
   
   # Test Redis connection
   docker exec -it pos-redis redis-cli ping
   ```

### Health Checks

All services include health checks. Monitor them with:
```bash
docker-compose ps
```

## Development vs Production

### Development
- All services run locally
- No SSL certificates
- Debug logging enabled
- Exposed ports for direct access

### Production
- Use external SSL certificates
- Configure proper firewall rules
- Set up automated backups
- Monitor resource usage
- Use secrets management for passwords

## Scaling Considerations

### Horizontal Scaling
- MongoDB: Use replica sets
- Redis: Use Redis Cluster
- Nginx: Use multiple instances with load balancer

### Vertical Scaling
- Adjust memory limits in docker-compose.yml
- Configure resource limits for containers
- Monitor and optimize database queries

## Maintenance

### Regular Tasks
- Monitor disk usage
- Review logs for errors
- Update container images
- Backup databases
- Review security settings

### Updates
```bash
# Update all images
docker-compose pull

# Restart services with new images
docker-compose up -d
```

## Support

For issues and questions:
1. Check service logs
2. Review configuration files
3. Test individual services
4. Check resource usage
5. Verify network connectivity 