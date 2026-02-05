# Quick Commands Cheat Sheet

## 🚀 Installation

```bash
# Install aliases (one time)
cd ~/Docker/message-relay
./install-aliases.sh
source ~/.zshrc
```

## ⚡ Most Used Commands

```bash
relay-help           # 📖 Show all commands
relay-status         # ✅ Is it running?
relay-logs           # 📋 Watch logs (Ctrl+C to stop)
relay-restart        # 🔄 Restart service
relay-test           # 🧪 Send test message
```

## 🔧 Service Control

```bash
relay-start          # ▶️  Start
relay-stop           # ⏹️  Stop  
relay-restart        # 🔄 Restart
relay-status         # ❓ Check status
relay-full-status    # 📊 Detailed status
```

## 📋 Logs

```bash
relay-logs           # 👁️  Watch logs live
relay-errors         # ❌ Watch errors
relay-logs-last      # 📄 Last 50 lines
relay-logs-color     # 🎨 Colored logs
relay-logs-clear     # 🗑️  Clear all logs
relay-search error   # 🔍 Search logs
```

## 🧪 Testing

```bash
relay-test                           # Quick test
relay-health                         # Check /health
relay-send '+1234567890' 'Hello!'   # Send custom message
```

## ℹ️ Information

```bash
relay-info           # 📱 Service summary
relay-full-status    # 📊 Complete report
relay-logs-size      # 📏 Log file sizes
```

## 📁 Navigation

```bash
relay-cd             # Go to project
relay-logs-cd        # Go to logs folder
```

## 💡 Examples

```bash
# Watch logs in one terminal, test in another
relay-logs           # Terminal 1
relay-test           # Terminal 2

# Debug issues
relay-full-status    # See what's wrong
relay-search error   # Find errors
relay-restart        # Try restarting

# Clean up
relay-logs-size      # Check size
relay-logs-clear     # Clear if too big

# Send custom message
relay-send '+1234567890' 'Hello World!'
```

## 🔗 Combining Commands

```bash
relay-restart && relay-logs              # Restart and watch
relay-test && sleep 2 && relay-logs-last # Test and see result
relay-logs | grep "Message sent"         # Filter logs
```

## 📖 More Help

```bash
relay-help                    # All commands with examples
cat ALIASES_REFERENCE.md      # Complete documentation
cat AUTOSTART_GUIDE.md        # Full setup guide
```

---

**Print this and keep it by your desk!** 📄
