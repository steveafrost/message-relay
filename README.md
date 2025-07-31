# Server Script Project

This project is designed to run on a Mac Mini and listens for webhook requests from a Raspberry Pi. Upon receiving a message, it sends the message via iMessage to specified phone numbers.

## Project Structure

```
server-script-project
├── src
│   ├── server.js          # Entry point of the server application
│   ├── services
│   │   ├── webhookHandler.js # Handles incoming webhook requests
│   │   └── imessageSender.js  # Sends messages via iMessage
│   └── utils
│       └── index.js       # Utility functions
├── package.json           # npm configuration file
├── .env                   # Environment variables
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # Project documentation
```

## Setup Instructions

### Option 1: Local Development

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd server-script-project
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the necessary configuration settings.

4. **Run the server:**
   ```
   npm start
   ```

### Option 2: Docker Deployment (Recommended for M2 Mac Mini)

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd server-script-project
   ```

2. **Create environment file:**
   Create a `.env` file with your phone numbers:
   ```
   PHONE_NUMBERS=+1234567890,+1987654321
   PORT=3000
   NODE_ENV=production
   ```

3. **Build and run with Docker Compose:**
   ```bash
   # Build the container
   docker-compose build
   
   # Run the service
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

## Usage

Once the server is running, it will listen for incoming webhook requests. The expected payload format is as follows:

```json
{
  "message": "Your message here"
}
```

Upon receiving a valid request, the server will extract the message and send it via iMessage to all phone numbers specified in the `PHONE_NUMBERS` environment variable.

## Docker Configuration

The Docker setup is specifically configured for ARM64 architecture (M2 Mac) and includes:

- **Multi-stage build** for optimized image size
- **Health checks** for container monitoring
- **Volume mounts** for AppleScript access to the host Messages app
- **Non-root user** for security
- **Automatic restarts** unless manually stopped

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.