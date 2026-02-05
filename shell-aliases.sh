#!/bin/bash
# Message Relay Service - Shell Aliases
# Add these to your ~/.zshrc or ~/.bashrc for easy service management

# Service Management
alias relay-start='launchctl load ~/Library/LaunchAgents/com.message-relay.plist && echo "✅ Service started"'
alias relay-stop='launchctl unload ~/Library/LaunchAgents/com.message-relay.plist && echo "🛑 Service stopped"'
alias relay-restart='launchctl unload ~/Library/LaunchAgents/com.message-relay.plist 2>/dev/null; launchctl load ~/Library/LaunchAgents/com.message-relay.plist && echo "🔄 Service restarted"'
alias relay-status='launchctl list | grep message-relay || echo "❌ Service not running"'

# Log Viewing
alias relay-logs='tail -f ~/Docker/message-relay/logs/service.log'
alias relay-errors='tail -f ~/Docker/message-relay/logs/service.error.log'
alias relay-logs-all='tail -f ~/Docker/message-relay/logs/*.log'
alias relay-logs-last='tail -50 ~/Docker/message-relay/logs/service.log'
alias relay-logs-errors-last='tail -50 ~/Docker/message-relay/logs/service.error.log'

# Log Management
alias relay-logs-clear='rm ~/Docker/message-relay/logs/*.log 2>/dev/null; touch ~/Docker/message-relay/logs/service.log ~/Docker/message-relay/logs/service.error.log && echo "🗑️  Logs cleared"'
alias relay-logs-size='du -h ~/Docker/message-relay/logs/*.log 2>/dev/null || echo "No logs found"'

# Quick Navigation
alias relay-cd='cd ~/Docker/message-relay'
alias relay-logs-cd='cd ~/Docker/message-relay/logs'

# Testing
alias relay-test='curl -X POST http://localhost:3000/webhook -H "Content-Type: application/json" -d '"'"'{"message": "Test from alias!", "phoneNumbers": ["+1234567890"]}'"'"''
alias relay-health='curl -s http://localhost:3000/health | jq . || curl -s http://localhost:3000/health'

# Advanced
alias relay-tail='tail -n 100 ~/Docker/message-relay/logs/service.log | grep -E "(error|Error|ERROR|✅|❌|⚠️)" || tail -n 100 ~/Docker/message-relay/logs/service.log'
alias relay-watch='watch -n 2 "launchctl list | grep message-relay"'
alias relay-reinstall='cd ~/Docker/message-relay && ./setup-autostart.sh'

# Info
alias relay-info='echo "📱 Message Relay Service"; echo ""; echo "Status:"; launchctl list | grep message-relay || echo "Not running"; echo ""; echo "Logs:"; ls -lh ~/Docker/message-relay/logs/*.log 2>/dev/null || echo "No logs"; echo ""; echo "Port: 3000"; echo "Config: ~/Docker/message-relay/.env"'

# Function: Search logs
relay-search() {
    if [ -z "$1" ]; then
        echo "Usage: relay-search <search-term>"
        echo "Example: relay-search 'error'"
        return 1
    fi
    grep -i "$1" ~/Docker/message-relay/logs/service.log
}

# Function: Send test message
relay-send() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: relay-send <phone-number> <message>"
        echo "Example: relay-send '+1234567890' 'Hello World'"
        return 1
    fi
    curl -X POST http://localhost:3000/webhook \
        -H "Content-Type: application/json" \
        -d "{\"message\": \"$2\", \"phoneNumbers\": [\"$1\"]}"
    echo ""
}

# Function: View logs with color
relay-logs-color() {
    tail -f ~/Docker/message-relay/logs/service.log | awk '
        /error|Error|ERROR|fail|Fail|FAIL/ {print "\033[31m" $0 "\033[0m"; next}
        /success|Success|SUCCESS|✅/ {print "\033[32m" $0 "\033[0m"; next}
        /warn|Warning|WARNING|⚠️/ {print "\033[33m" $0 "\033[0m"; next}
        /info|Info|INFO|ℹ️/ {print "\033[34m" $0 "\033[0m"; next}
        {print $0}
    '
}

# Function: Show complete service status
relay-full-status() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📱 Message Relay Service - Full Status"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo "🔧 Service Status:"
    if launchctl list | grep -q message-relay; then
        launchctl list | grep message-relay
        echo "✅ Running"
    else
        echo "❌ Not Running"
    fi
    echo ""
    
    echo "📊 Process Info:"
    ps aux | grep "message-relay\|node.*server.js" | grep -v grep || echo "No process found"
    echo ""
    
    echo "📁 Log Files:"
    ls -lh ~/Docker/message-relay/logs/*.log 2>/dev/null || echo "No logs found"
    echo ""
    
    echo "🌐 Port Check:"
    lsof -i :3000 | grep LISTEN || echo "Port 3000 not in use"
    echo ""
    
    echo "📝 Recent Logs (last 5 lines):"
    tail -5 ~/Docker/message-relay/logs/service.log 2>/dev/null || echo "No logs available"
    echo ""
    
    echo "⚠️  Recent Errors (if any):"
    tail -5 ~/Docker/message-relay/logs/service.error.log 2>/dev/null | grep -v "^$" || echo "No errors"
    echo ""
}

# Help function
relay-help() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📱 Message Relay Service - Quick Reference"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🔧 Service Management:"
    echo "  relay-start          - Start the service"
    echo "  relay-stop           - Stop the service"
    echo "  relay-restart        - Restart the service"
    echo "  relay-status         - Check if running"
    echo "  relay-full-status    - Complete status report"
    echo "  relay-reinstall      - Reinstall/reconfigure service"
    echo ""
    echo "📋 Logs:"
    echo "  relay-logs           - Watch logs in real-time"
    echo "  relay-errors         - Watch error logs"
    echo "  relay-logs-all       - Watch all logs"
    echo "  relay-logs-last      - Show last 50 lines"
    echo "  relay-logs-color     - Watch logs with color highlighting"
    echo "  relay-logs-clear     - Clear all logs"
    echo "  relay-logs-size      - Show log file sizes"
    echo "  relay-search <term>  - Search logs for text"
    echo ""
    echo "🧪 Testing:"
    echo "  relay-test           - Send test message"
    echo "  relay-health         - Check health endpoint"
    echo "  relay-send <phone> <msg> - Send custom message"
    echo ""
    echo "📁 Navigation:"
    echo "  relay-cd             - Go to project directory"
    echo "  relay-logs-cd        - Go to logs directory"
    echo "  relay-info           - Show service info"
    echo ""
    echo "💡 Examples:"
    echo "  relay-logs | grep error"
    echo "  relay-search 'Message sent'"
    echo "  relay-send '+1234567890' 'Hello!'"
    echo ""
    echo "📖 For more help, see: ~/Docker/message-relay/AUTOSTART_GUIDE.md"
    echo ""
}
