# Message Relay Service

A Node.js webhook service that receives messages and sends them via iMessage on macOS. Designed to run in Docker containers with ARM64 architecture support for Apple Silicon Macs.

## 🚀 Features

- **Webhook Endpoint**: Accepts POST requests with message payloads
- **iMessage Integration**: Sends messages via macOS Messages app
- **Docker Support**: ARM64-optimized container for Apple Silicon
- **Health Monitoring**: Built-in health check endpoint
- **Graceful Shutdown**: Proper signal handling
- **Resource Management**: Memory and CPU limits for stability

## 📁 Project Structure

```
message-relay/
├── src/
│   ├── server.js              # Express server entry point
│   └── services/
│       ├── webhookHandler.js  # Webhook request handler
│       └── imessageSender.js  # iMessage sending service
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # ARM64-optimized Docker image
├── package.json              # Node.js dependencies
├── run-macos.sh             # Direct macOS execution script
└── README.md                # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- macOS with Messages app
- Docker Desktop (for containerized deployment)
- Node.js 20+ (for direct execution)

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd message-relay
   ```

2. **Create environment file:**
   Create a `.env` file with your phone numbers:
   ```bash
   PHONE_NUMBERS=+1234567890,+1987654321
   PORT=3000
   NODE_ENV=production
   ```

3. **Build and run with Docker Compose:**
   ```bash
   # Build the ARM64 container
   docker-compose build
   
   # Start the service
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop the service
   docker-compose down
   ```

4. **Test the webhook:**
   ```bash
   curl -X POST http://localhost:3000/webhook \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello from Docker!"}'
   ```

### Option 2: Direct macOS Execution (For iMessage Testing)

For testing actual iMessage functionality:

1. **Run directly on macOS:**
   ```bash
   chmod +x run-macos.sh
   ./run-macos.sh
   ```

2. **Test with actual Messages:**
   ```bash
   curl -X POST http://localhost:3000/webhook \
     -H "Content-Type: application/json" \
     -d '{"message": "Testing actual iMessage!"}'
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PHONE_NUMBERS` | Comma-separated phone numbers | `+1234567890,+1987654321` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |

### Docker Configuration

The service uses ARM64-optimized Docker images:
- **Base Image**: `arm64v8/node:20-alpine`
- **Platform**: `linux/arm64`
- **Architecture**: Optimized for Apple Silicon (M1/M2/M3)

## 📡 API Reference

### Webhook Endpoint

**POST** `/webhook`

Send a message to all configured phone numbers.

**Request Body:**
```json
{
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Health Check

**GET** `/health`

Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

### Test Different Scenarios

```bash
# Basic message
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World!"}'

# Message with emojis
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "🚀 Docker container is working!"}'

# Test error handling (missing message)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{}'

# Health check
curl -X GET http://localhost:3000/health
```

## 🔍 Troubleshooting

### Common Issues

1. **Container won't start:**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

2. **Permission denied errors:**
   ```bash
   chmod +x run-macos.sh
   ```

3. **Messages not sending:**
   - Ensure Messages app is open on macOS
   - Check phone numbers are in correct format
   - Verify iMessage is enabled for target numbers

### Logs and Debugging

```bash
# View container logs
docker logs message-relay

# Follow logs in real-time
docker-compose logs -f

# Check container status
docker ps
```

## 🏗️ Architecture

### Docker Setup
- **ARM64 Architecture**: Optimized for Apple Silicon
- **Multi-stage Build**: Smaller, secure images
- **Health Checks**: Automatic monitoring
- **Resource Limits**: Memory and CPU constraints
- **Graceful Shutdown**: Proper signal handling

### Service Components
- **Express Server**: HTTP endpoint handling
- **Webhook Handler**: Request validation and processing
- **iMessage Sender**: AppleScript integration for Messages app

## 📝 Development

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run docker:up  # Start Docker container
npm run docker:down # Stop Docker container
npm run docker:logs # View Docker logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Built for ARM64 architecture compatibility
- Optimized for Apple Silicon Macs
- Docker-first deployment strategy