# Message Relay Service

A Node.js webhook service that receives messages and sends them via iMessage on macOS.

## 🚀 Features

- **Webhook Endpoint**: Accepts POST requests with message payloads
- **iMessage Integration**: Sends messages via macOS Messages app using AppleScript
- **Group Messaging**: Sends to multiple recipients simultaneously (individual messages)
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
│       └── imessageSender.js  # iMessage sending service (AppleScript)
├── package.json              # Node.js dependencies
├── run-macos.sh             # Direct macOS execution script
└── README.md                # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- macOS with Messages app
- Node.js 20+

**Note**: The service uses AppleScript to interact with the macOS Messages app.

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd message-relay
   ```

2. **Create environment file (optional):**
   Create a `.env` file with fallback phone numbers (optional):

   ```bash
   PHONE_NUMBERS=+1234567890,+1987654321
   PORT=3000
   NODE_ENV=production
   ```

   **Note:** The `PHONE_NUMBERS` environment variable is now optional. You can provide phone numbers directly in each webhook request instead.

### Running the Service

#### Option 1: Auto-Start on Boot (Recommended)

Set up the service to start automatically when your Mac boots:

```bash
# One-time setup
./setup-autostart.sh

# Install helpful aliases
./install-aliases.sh
source ~/.zshrc
```

Now you can use commands like:
```bash
relay-start          # Start service
relay-stop           # Stop service
relay-restart        # Restart service
relay-logs           # Watch logs
relay-status         # Check status
relay-help           # See all commands
```

See `AUTOSTART_GUIDE.md` for complete documentation.

#### Option 2: Manual Execution

Run directly when needed:

```bash
chmod +x run-macos.sh
./run-macos.sh
```

#### Test the Service

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Testing iMessage!", "phoneNumbers": ["+1234567890"]}'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PHONE_NUMBERS` | Comma-separated phone numbers (fallback) | `+1234567890,+1987654321` | No* |
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment mode | `production` | No |

*`PHONE_NUMBERS` is only required if you don't provide phone numbers in the webhook request body.

## 📡 API Reference

### Webhook Endpoint

**POST** `/webhook`

Send a message to all configured phone numbers (sends individual messages to each recipient).

**Request Body:**

```json
{
  "message": "Your message here",
  "phoneNumbers": ["+1234567890", "+1987654321"],
  "groupKeyword": "Weekend Crew"
}
```

**Fields:**

- `message` (required): The message to send
- `phoneNumbers` (optional): Array of phone numbers. If not provided, uses `PHONE_NUMBERS` environment variable
- `groupKeyword` (optional): Keyword to find existing group chat. If provided, sends to the group chat instead of individual recipients

**Response:**

```json
{
  "success": true,
  "message": "Message sent to group chat: Weekend Crew",
  "recipients": 2,
  "phoneNumbers": ["+1234567890", "+1987654321"],
  "groupChat": "Weekend Crew"
}
```

**Note**:

- If `groupKeyword` is provided, the message is sent to the existing group chat
- If no `groupKeyword` or group chat not found, messages are sent individually to each recipient
- The `groupChat` field shows which group chat was used (if any)

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
# Basic message (uses environment variable phone numbers)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World!"}'

# Message with custom phone numbers
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Custom recipients message!", "phoneNumbers": ["+1234567890", "+1987654321"]}'

# Message to existing group chat
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Group chat message!", "phoneNumbers": ["+1234567890", "+1987654321"], "groupKeyword": "Weekend Crew"}'

# Message with emojis
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "🚀 Service is working!"}'

# Test error handling (missing message)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{}'

# Health check
curl -X GET http://localhost:3000/health
```

## 🔍 Troubleshooting

### Common Issues

1. **Permission denied errors:**

   ```bash
   chmod +x run-macos.sh
   chmod +x setup-autostart.sh
   ```

2. **Messages not sending:**
   - Ensure Messages app is open on macOS
   - Check phone numbers are in correct format (+1234567890)
   - Verify iMessage is enabled for target numbers
   - Grant Terminal or your shell app accessibility permissions in System Preferences:
     - Go to System Preferences → Security & Privacy → Privacy → Automation
     - Allow Terminal to control Messages

3. **Port already in use:**

   ```bash
   # Find what's using port 3000
   lsof -i :3000
   
   # Change the port in .env file
   PORT=8080
   ```

4. **Service won't start (autostart):**
   
   ```bash
   # Check service status
   relay-status
   
   # View logs
   relay-logs
   
   # Reinstall service
   ./setup-autostart.sh
   ```

5. **Can't find relay commands:**
   
   ```bash
   # Install/reinstall aliases
   ./install-aliases.sh
   source ~/.zshrc
   ```

## 🏗️ Architecture

### Service Components

- **Express Server**: HTTP endpoint handling
- **Webhook Handler**: Request validation and processing
- **iMessage Sender**: AppleScript integration for Messages app with group messaging support

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
npm test           # Run tests
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

- Uses native AppleScript for reliable iMessage integration
