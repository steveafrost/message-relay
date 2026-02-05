# Shell Aliases - Quick Reference

## Installation

```bash
cd ~/Docker/message-relay
./install-aliases.sh

# Then activate:
source ~/.zshrc  # or ~/.bashrc
```

## All Available Commands

### 🔧 Service Management

| Command | What It Does |
|---------|-------------|
| `relay-start` | Start the service |
| `relay-stop` | Stop the service |
| `relay-restart` | Restart the service |
| `relay-status` | Check if service is running |
| `relay-full-status` | Complete status report (recommended!) |
| `relay-reinstall` | Reinstall/reconfigure service |

### 📋 Log Viewing

| Command | What It Does |
|---------|-------------|
| `relay-logs` | Watch logs in real-time (tail -f) |
| `relay-errors` | Watch error logs in real-time |
| `relay-logs-all` | Watch all logs (stdout + stderr) |
| `relay-logs-last` | Show last 50 lines of logs |
| `relay-logs-errors-last` | Show last 50 error lines |
| `relay-logs-color` | Watch logs with color highlighting |

### 🗑️ Log Management

| Command | What It Does |
|---------|-------------|
| `relay-logs-clear` | Clear all log files |
| `relay-logs-size` | Show log file sizes |

### 🔍 Search & Analysis

| Command | What It Does | Example |
|---------|-------------|---------|
| `relay-search <term>` | Search logs for text | `relay-search "error"` |
| `relay-tail` | Show last 100 lines with highlights | `relay-tail` |
| `relay-watch` | Live watch service status | `relay-watch` |

### 🧪 Testing

| Command | What It Does | Example |
|---------|-------------|---------|
| `relay-test` | Send test message to default number | `relay-test` |
| `relay-health` | Check health endpoint | `relay-health` |
| `relay-send <phone> <msg>` | Send custom message | `relay-send '+1234567890' 'Hi!'` |

### 📁 Navigation

| Command | What It Does |
|---------|-------------|
| `relay-cd` | Go to project directory |
| `relay-logs-cd` | Go to logs directory |

### ℹ️ Information

| Command | What It Does |
|---------|-------------|
| `relay-info` | Show service info summary |
| `relay-help` | Show complete help (try this first!) |

## Usage Examples

### Common Workflows

#### Check if service is running
```bash
relay-status
# or for detailed info
relay-full-status
```

#### Watch logs while testing
```bash
# Terminal 1: Watch logs
relay-logs

# Terminal 2: Send test
relay-test
```

#### Debug an issue
```bash
# Check full status
relay-full-status

# Search for errors
relay-search "error"

# View recent errors
relay-logs-errors-last

# Restart if needed
relay-restart
```

#### Clean up logs
```bash
# Check log sizes first
relay-logs-size

# Clear if too large
relay-logs-clear

# Verify
relay-logs-size
```

### Advanced Examples

#### Watch logs with color highlighting
```bash
relay-logs-color
# Errors = red, success = green, warnings = yellow
```

#### Search and pipe
```bash
# Find all error messages
relay-search error

# Find with context
grep -C 3 "error" ~/Docker/message-relay/logs/service.log

# Count occurrences
relay-search "Message sent" | wc -l
```

#### Send custom message
```bash
# Simple
relay-send '+1234567890' 'Hello World'

# With special characters (use quotes)
relay-send '+1234567890' 'Test with "quotes" and $pecial'

# Emoji support
relay-send '+1234567890' 'Hello 👋 World 🌍'
```

#### Monitor in real-time
```bash
# Watch service status every 2 seconds
relay-watch

# Press Ctrl+C to stop
```

## Combining Commands

```bash
# Restart and immediately watch logs
relay-restart && relay-logs

# Check status, then show recent logs
relay-status && relay-logs-last

# Test and watch for result
relay-test && sleep 2 && relay-logs-last | grep "Test"

# Clear logs, restart, and watch
relay-logs-clear && relay-restart && relay-logs
```

## Pipe & Grep Examples

```bash
# Show only errors from logs
relay-logs | grep -i error

# Show successful message sends
relay-logs | grep "Message sent"

# Count specific events
relay-search "webhook" | wc -l

# Show last hour of logs (if timestamps in logs)
relay-logs-last | grep "$(date +%H:)"

# Highlight specific text
relay-logs | grep --color=always "Message sent"
```

## Pro Tips

### 1. Create Your Own Aliases

Add to your `~/.zshrc`:

```bash
# Custom shortcuts
alias rl='relay-logs'
alias rs='relay-status'
alias rr='relay-restart'

# Quick test with your number
alias relay-test-me='relay-send "+1234567890" "Quick test"'

# Restart and watch
alias relay-rw='relay-restart && sleep 2 && relay-logs'
```

### 2. Use in Scripts

```bash
#!/bin/bash
# my-deploy.sh

relay-stop
# ... do updates ...
relay-start
relay-full-status
```

### 3. Monitor with Notifications

```bash
# macOS notification when service stops
while true; do
  relay-status || osascript -e 'display notification "Service stopped!" with title "Message Relay"'
  sleep 60
done
```

### 4. Log Analysis

```bash
# Daily summary
echo "Messages sent today:"
grep "$(date +%Y-%m-%d)" ~/Docker/message-relay/logs/service.log | grep "Message sent" | wc -l

# Error rate
TOTAL=$(relay-logs-last | wc -l)
ERRORS=$(relay-logs-last | grep -i error | wc -l)
echo "Error rate: $ERRORS/$TOTAL"
```

## Keyboard Shortcuts

If you use these commands a lot, add to `~/.zshrc`:

```bash
# Ctrl+R then type 'relay' to search history
# Or use fzf for fuzzy finding

# zsh-autosuggestions will suggest based on history
# Install: brew install zsh-autosuggestions
```

## Troubleshooting

### Aliases not working?

```bash
# Reload shell config
source ~/.zshrc  # or ~/.bashrc

# Check if aliases exist
alias | grep relay

# Reinstall
cd ~/Docker/message-relay
./install-aliases.sh
source ~/.zshrc
```

### Command not found?

Make sure you've activated the aliases:
```bash
source ~/.zshrc
```

Or restart your terminal.

### Wrong path?

The aliases assume project is at `~/Docker/message-relay`. If different:

1. Edit `~/.zshrc`
2. Change the paths in aliases
3. Run `source ~/.zshrc`

## Uninstalling

To remove the aliases:

```bash
# Edit your shell config
nano ~/.zshrc  # or ~/.bashrc

# Delete the section between these lines:
# # Message Relay Service - Aliases
# ...
# # End Message Relay Aliases

# Save and reload
source ~/.zshrc
```

## Help

Can't remember a command?

```bash
relay-help
```

This shows everything with examples!

---

## Quick Command Summary

Most used commands:
```bash
relay-help           # See all commands
relay-status         # Is it running?
relay-logs           # Watch logs
relay-restart        # Restart service
relay-test           # Send test message
relay-full-status    # Complete status
```

That's it! Start with `relay-help` and explore from there. 🚀
