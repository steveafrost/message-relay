# Deployment Guide

## 🚀 Quick Start

### Docker Deployment (Recommended)

```bash
# 1. Clone and setup
git clone <repository-url>
cd message-relay

# 2. Create environment file (optional)
echo "PHONE_NUMBERS=+1234567890,+1987654321" > .env
echo "# Note: PHONE_NUMBERS is now optional - can be provided in webhook requests"

# 3. Deploy with Docker Compose
docker-compose up -d

# 4. Test the service
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from deployment!"}'
```

### Direct macOS Execution (For iMessage Testing)

```bash
# 1. Make script executable
chmod +x run-macos.sh

# 2. Run directly on macOS
./run-macos.sh

# 3. Test with actual Messages
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Testing iMessage!"}'
```

## 🏗️ Architecture Overview

### ARM64-Optimized Docker Setup

- **Base Image**: `arm64v8/node:20-alpine`
- **Platform**: `linux/arm64`
- **Architecture**: Apple Silicon (M1/M2/M3) optimized
- **Resource Limits**: 512MB memory, 0.5 CPU cores
- **Health Checks**: Automatic monitoring every 30s

### Service Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Webhook       │    │   Message        │    │   iMessage      │
│   Handler       │───▶│   Processor      │───▶│   Sender        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] macOS with Messages app installed
- [ ] Docker Desktop running
- [ ] Phone numbers configured in `.env` (optional) or provided in webhook requests
- [ ] Network access to port 3000
- [ ] iMessage enabled for target numbers

### Deployment Steps

1. **Environment Setup (Optional)**
   ```bash
   # Create .env file for fallback phone numbers (optional)
   cat > .env << EOF
   PHONE_NUMBERS=+1234567890,+1987654321
   PORT=3000
   NODE_ENV=production
   EOF
   
   # Note: PHONE_NUMBERS is optional - can be provided in webhook requests instead
   ```

2. **Docker Deployment**
   ```bash
   # Build and start
   docker-compose up --build -d
   
   # Verify deployment
   docker ps
   docker logs message-relay
   ```

3. **Health Check**
   ```bash
   # Test health endpoint
   curl http://localhost:3000/health
   
   # Test webhook
   curl -X POST http://localhost:3000/webhook \
     -H "Content-Type: application/json" \
     -d '{"message": "Deployment test"}'
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PHONE_NUMBERS` | ❌ | - | Comma-separated phone numbers (fallback) |
| `PORT` | ❌ | `3000` | Server port |
| `NODE_ENV` | ❌ | `production` | Environment mode |

### Docker Configuration

```yaml
# Key Docker settings
platform: linux/arm64          # Apple Silicon optimization
memory: 512M                   # Memory limit
cpus: '0.5'                   # CPU limit
restart: unless-stopped        # Auto-restart policy
healthcheck: 30s interval      # Health monitoring
```

## 📊 Monitoring & Health Checks

### Built-in Monitoring

```bash
# Health check endpoint
curl http://localhost:3000/health

# Container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Resource usage
docker stats message-relay
```

### Log Monitoring

```bash
# View logs
docker-compose logs -f

# Filter error logs
docker-compose logs | grep ERROR

# Recent logs
docker-compose logs --tail=100
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check for port conflicts
lsof -i :3000

# Rebuild container
docker-compose down
docker-compose up --build -d
```

#### 2. Messages Not Sending
```bash
# Check container logs
docker logs message-relay

# Verify Messages app is open
osascript -e 'tell application "Messages" to activate'

# Test AppleScript directly
osascript -e 'tell application "Messages" to send "test" to buddy "+1234567890"'
```

#### 3. Permission Issues
```bash
# Fix script permissions
chmod +x run-macos.sh

# Check Docker permissions
docker system info
```

### Debug Commands

```bash
# Container inspection
docker inspect message-relay

# Resource usage
docker stats message-relay

# Network connectivity
docker exec message-relay ping -c 3 google.com

# Process list
docker exec message-relay ps aux
```

## 🔄 Maintenance

### Regular Tasks

#### Daily
- [ ] Check container health: `docker ps`
- [ ] Review logs: `docker-compose logs --tail=50`
- [ ] Test webhook: `curl -X POST http://localhost:3000/webhook -H "Content-Type: application/json" -d '{"message": "Daily health check"}'`

#### Weekly
- [ ] Update dependencies: `npm update`
- [ ] Rebuild container: `docker-compose build --no-cache`
- [ ] Backup configuration: `cp .env .env.backup`

#### Monthly
- [ ] Security audit: `npm audit`
- [ ] Update base image in Dockerfile
- [ ] Review resource usage patterns

### Update Procedures

```bash
# 1. Stop current deployment
docker-compose down

# 2. Pull latest changes
git pull origin main

# 3. Rebuild with new code
docker-compose up --build -d

# 4. Verify deployment
curl http://localhost:3000/health
```

## 🛡️ Security Considerations

### Current Security Features

- ✅ Non-root user in container
- ✅ Minimal base image (Alpine Linux)
- ✅ Resource limits to prevent DoS
- ✅ Health checks for monitoring
- ✅ Graceful shutdown handling

### Recommended Security Practices

```bash
# Regular security updates
npm audit --audit-level=high

# Container vulnerability scanning
docker scan message-relay-message-relay

# Network isolation (if needed)
# Add to docker-compose.yml:
# networks:
#   - internal-network
```

## 📈 Scaling Considerations

### Current Resource Limits

- **Memory**: 512MB max, 256MB reserved
- **CPU**: 0.5 cores max, 0.25 cores reserved
- **Storage**: Minimal (Alpine base)

### Scaling Options

#### Vertical Scaling
```yaml
# Increase in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '1.0'
```

#### Horizontal Scaling
```bash
# Multiple containers (requires load balancer)
docker-compose up -d --scale message-relay=3
```

## 🔄 Backup & Recovery

### Backup Strategy

```bash
# Backup configuration
cp .env .env.backup.$(date +%Y%m%d)

# Backup Docker images
docker save message-relay-message-relay > message-relay-backup.tar

# Backup logs (if persistent)
docker run --rm -v message-relay_logs:/data -v $(pwd):/backup alpine tar czf /backup/logs-backup.tar.gz -C /data .
```

### Recovery Procedures

#### Quick Recovery
```bash
# Restart service
docker-compose restart

# Restore from backup
cp .env.backup.20240101 .env
docker-compose up -d
```

#### Full Recovery
```bash
# 1. Clone repository
git clone <repository-url>
cd message-relay

# 2. Restore configuration
cp .env.backup.20240101 .env

# 3. Rebuild and deploy
docker-compose up --build -d

# 4. Verify recovery
curl http://localhost:3000/health
```

## 🚀 Production Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Health monitoring enabled
- [ ] Log rotation configured
- [ ] Backup strategy implemented
- [ ] Security measures in place
- [ ] Resource limits set
- [ ] Documentation updated

### Production Commands

```bash
# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Monitor production
docker-compose logs -f --tail=100

# Scale production
docker-compose up -d --scale message-relay=2
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [ARM64 Architecture Guide](https://developer.arm.com/)
- [AppleScript Reference](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/) 