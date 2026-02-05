# Message Relay - Project Overview

## What This Is

A simple Node.js webhook service that receives HTTP requests and sends them as iMessages on macOS using AppleScript.

## Key Features

- ✅ **Webhook endpoint** - POST messages via HTTP
- ✅ **iMessage integration** - Sends via Messages app
- ✅ **Group messaging** - Send to multiple recipients or existing group chats
- ✅ **Auto-start** - Runs automatically on Mac boot
- ✅ **Easy management** - Shell aliases for common tasks

## Quick Start

```bash
# 1. Set up auto-start
./setup-autostart.sh

# 2. Install helpful aliases
./install-aliases.sh
source ~/.zshrc

# 3. Check status
relay-status

# 4. Watch logs
relay-logs

# 5. Send test message
relay-test
```

## Files Structure

### Core Application
- `src/server.js` - Express server
- `src/services/webhookHandler.js` - Webhook request handler
- `src/services/imessageSender.js` - iMessage/AppleScript integration
- `package.json` - Dependencies

### Execution Scripts
- `run-macos.sh` - Manual run script
- `start-service.sh` - Service wrapper (loads .env)

### Auto-Start (New!)
- `com.message-relay.plist` - macOS service configuration
- `setup-autostart.sh` - One-command installer
- `AUTOSTART_GUIDE.md` - Complete auto-start documentation

### Shell Aliases (New!)
- `install-aliases.sh` - Install helpful aliases
- `shell-aliases.sh` - Alias definitions
- `ALIASES_REFERENCE.md` - All commands explained
- `QUICK_COMMANDS.md` - Cheat sheet

### Documentation
- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `GROUP_MESSAGING_UPDATE.md` - Group messaging features

### Testing
- `test-group-message.js` - Test group messaging
- `test-webhook-flexibility.js` - Test webhook flexibility

### Other
- `.env` - Environment variables (phone numbers, port)
- `.gitignore` - Git ignore rules
- `logs/` - Service logs (when using auto-start)

## Common Commands

After installing aliases:

```bash
relay-help           # Show all commands
relay-status         # Check if running
relay-logs           # Watch logs
relay-restart        # Restart service
relay-test           # Send test message
relay-full-status    # Complete status report
```

## Usage

### Send Message
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "phoneNumbers": ["+1234567890"]}'
```

### Send to Group Chat
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Team meeting!", "groupKeyword": "Work Team"}'
```

## How Auto-Start Works

1. `setup-autostart.sh` installs a macOS launchd service
2. Service starts automatically when Mac boots
3. Logs go to `logs/service.log`
4. Use `relay-*` commands to manage it

## Requirements

- macOS with Messages app
- Node.js 20+
- iMessage account configured

## That's It!

Simple, focused, and it works. No Docker complexity, no external dependencies, just a webhook → iMessage relay that runs on your Mac.

For questions, see the documentation files or run `relay-help`.
