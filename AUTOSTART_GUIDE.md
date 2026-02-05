# Auto-Start Setup Guide

## Overview

This guide shows you how to set up your message-relay service to:
- ✅ Start automatically when your Mac boots
- ✅ Restart automatically if it crashes
- ✅ View logs anytime from terminal
- ✅ Easy start/stop/restart

## Quick Setup (1 Minute)

```bash
cd /Users/white-box/Docker/message-relay

# Run the setup script
./setup-autostart.sh
```

That's it! Your service is now:
- ✅ Running right now
- ✅ Will start on every Mac boot
- ✅ Will restart if it crashes

## Viewing Logs

### View live logs (updates in real-time)
```bash
# Standard output (what the service prints)
tail -f ~/Docker/message-relay/logs/service.log

# Errors only
tail -f ~/Docker/message-relay/logs/service.error.log

# Both at once
tail -f ~/Docker/message-relay/logs/*.log
```

### View last 50 lines
```bash
tail -50 ~/Docker/message-relay/logs/service.log
```

### View all logs
```bash
cat ~/Docker/message-relay/logs/service.log
```

### Search logs
```bash
# Find specific text
grep "error" ~/Docker/message-relay/logs/service.log

# Find with context (2 lines before and after)
grep -C 2 "Message sent" ~/Docker/message-relay/logs/service.log
```

## Managing the Service

### Check if running
```bash
launchctl list | grep com.message-relay
```

If you see output, it's running!

### Stop the service
```bash
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
```

### Start the service
```bash
launchctl load ~/Library/LaunchAgents/com.message-relay.plist
```

### Restart the service
```bash
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
launchctl load ~/Library/LaunchAgents/com.message-relay.plist
```

Or use the helper script:
```bash
cd ~/Docker/message-relay
./setup-autostart.sh  # This restarts if already running
```

### View service status
```bash
launchctl list | grep message-relay
```

Output explanation:
```
12345   0   com.message-relay
  |     |   └─ Service name
  |     └─ Exit code (0 = running fine)
  └─ Process ID
```

## Uninstalling Auto-Start

If you want to remove auto-start:

```bash
# Stop and remove the service
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
rm ~/Library/LaunchAgents/com.message-relay.plist

# Service files remain, just won't auto-start
```

To re-enable, just run `./setup-autostart.sh` again.

## Configuration

### Update environment variables

Edit your `.env` file:
```bash
nano ~/Docker/message-relay/.env
```

After editing, restart the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
launchctl load ~/Library/LaunchAgents/com.message-relay.plist
```

### Change log location

Edit `com.message-relay.plist` and change these lines:
```xml
<key>StandardOutPath</key>
<string>/path/to/your/logs/service.log</string>

<key>StandardErrorPath</key>
<string>/path/to/your/logs/service.error.log</string>
```

Then reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
launchctl load ~/Library/LaunchAgents/com.message-relay.plist
```

## Troubleshooting

### Service won't start

1. **Check logs:**
   ```bash
   tail -50 ~/Docker/message-relay/logs/service.error.log
   ```

2. **Try running manually:**
   ```bash
   cd ~/Docker/message-relay
   ./run-macos.sh
   ```
   If this works but the service doesn't, there's a path or permission issue.

3. **Check Node.js path:**
   ```bash
   which node
   ```
   Make sure this matches the path in `com.message-relay.plist`

### Logs are empty

The service might not be running. Check:
```bash
launchctl list | grep message-relay
```

### Service keeps crashing

Check the error log:
```bash
tail -100 ~/Docker/message-relay/logs/service.error.log
```

Common issues:
- Port 3000 already in use
- .env file missing or incorrect
- Node modules not installed (`npm install`)

### Can't find logs directory

Create it manually:
```bash
mkdir -p ~/Docker/message-relay/logs
```

Then restart the service.

## Advanced Usage

### Run multiple instances

You can run multiple services on different ports:

1. Copy and rename the plist file
2. Change the port in a new .env file
3. Load both services

### Custom start script

The service uses `start-service.sh` as a wrapper. You can modify this to:
- Add custom environment setup
- Run pre-start checks
- Send notifications

### Monitoring

Install helpful shell aliases with one command:

```bash
cd ~/Docker/message-relay
./install-aliases.sh
source ~/.zshrc  # or ~/.bashrc
```

This gives you 30+ helpful commands like:
```bash
relay-logs         # Watch logs in real-time
relay-errors       # Watch error logs
relay-status       # Check status
relay-restart      # Restart service
relay-test         # Send test message
relay-help         # Show all commands
relay-full-status  # Complete status report
```

See **ALIASES_REFERENCE.md** for the complete list!

## Logs Management

### Automatic log rotation

macOS doesn't rotate logs automatically. To prevent logs from getting too large:

Create a script `rotate-logs.sh`:
```bash
#!/bin/bash
LOG_DIR="$HOME/Docker/message-relay/logs"
MAX_SIZE=10485760  # 10MB in bytes

for log in "$LOG_DIR"/*.log; do
    if [ -f "$log" ]; then
        size=$(stat -f%z "$log")
        if [ $size -gt $MAX_SIZE ]; then
            mv "$log" "$log.old"
            touch "$log"
            echo "Rotated $log"
        fi
    fi
done
```

Add to cron to run daily:
```bash
crontab -e
# Add: 0 0 * * * /Users/white-box/Docker/message-relay/rotate-logs.sh
```

### Clear logs

```bash
# Clear all logs
rm ~/Docker/message-relay/logs/*.log
touch ~/Docker/message-relay/logs/service.log
touch ~/Docker/message-relay/logs/service.error.log
```

## Testing

After setup, test that everything works:

```bash
# 1. Check service is running
launchctl list | grep message-relay

# 2. View logs
tail -f ~/Docker/message-relay/logs/service.log

# 3. Send test message
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Test auto-start!", "phoneNumbers": ["+1234567890"]}'

# 4. Check logs show the message
# You should see output in the log file

# 5. Test restart
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist
launchctl load ~/Library/LaunchAgents/com.message-relay.plist

# 6. Verify it's running again
launchctl list | grep message-relay
```

## Files Created

- `com.message-relay.plist` - Service configuration
- `start-service.sh` - Service wrapper script
- `setup-autostart.sh` - Setup/installation script
- `logs/service.log` - Standard output
- `logs/service.error.log` - Error output
- `~/Library/LaunchAgents/com.message-relay.plist` - Installed service

## Summary

After running `./setup-autostart.sh`:

✅ **Auto-starts on boot**
```bash
# Just restart your Mac and it'll be running
```

✅ **View logs anytime**
```bash
tail -f ~/Docker/message-relay/logs/service.log
```

✅ **Easy management**
```bash
# Stop
launchctl unload ~/Library/LaunchAgents/com.message-relay.plist

# Start
launchctl load ~/Library/LaunchAgents/com.message-relay.plist
```

✅ **Auto-restarts on crash**
```bash
# Automatically handled by launchd
```

That's it! Your service is now production-ready on your Mac! 🚀
