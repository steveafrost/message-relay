#!/bin/bash

# Setup script for message-relay auto-start service

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "==========================================="
echo "Message Relay Auto-Start Setup"
echo "==========================================="
echo ""

# Get the project directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICE_NAME="com.message-relay"
PLIST_FILE="$PROJECT_DIR/$SERVICE_NAME.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
INSTALLED_PLIST="$LAUNCH_AGENTS_DIR/$SERVICE_NAME.plist"

# Create logs directory
echo "Creating logs directory..."
mkdir -p "$PROJECT_DIR/logs"
echo -e "${GREEN}✅ Logs directory created${NC}"
echo ""

# Make scripts executable
echo "Making scripts executable..."
chmod +x "$PROJECT_DIR/start-service.sh"
chmod +x "$PROJECT_DIR/run-macos.sh"
echo -e "${GREEN}✅ Scripts are executable${NC}"
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js first"
    exit 1
fi

NODE_PATH=$(which node)
echo -e "${GREEN}✅ Node.js found at: $NODE_PATH${NC}"
echo ""

# Update plist with correct paths
echo "Configuring service..."
sed -i '' "s|/usr/local/bin/node|$NODE_PATH|g" "$PLIST_FILE"
sed -i '' "s|/Users/white-box/Docker/message-relay|$PROJECT_DIR|g" "$PLIST_FILE"
sed -i '' "s|<string>white-box</string>|<string>$USER</string>|g" "$PLIST_FILE"
echo -e "${GREEN}✅ Service configured${NC}"
echo ""

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Stop and unload existing service if it's running
if [ -f "$INSTALLED_PLIST" ]; then
    echo "Stopping existing service..."
    launchctl unload "$INSTALLED_PLIST" 2>/dev/null || true
    echo -e "${YELLOW}⚠️  Existing service stopped${NC}"
    echo ""
fi

# Copy plist to LaunchAgents
echo "Installing service..."
cp "$PLIST_FILE" "$INSTALLED_PLIST"
echo -e "${GREEN}✅ Service installed${NC}"
echo ""

# Load the service
echo "Starting service..."
launchctl load "$INSTALLED_PLIST"
echo -e "${GREEN}✅ Service started${NC}"
echo ""

# Wait a moment for service to start
sleep 2

# Check if service is running
if launchctl list | grep -q "$SERVICE_NAME"; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✅ Success! Service is running${NC}"
    echo -e "${GREEN}=========================================${NC}"
else
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}⚠️  Service may not be running${NC}"
    echo -e "${RED}=========================================${NC}"
fi

echo ""
echo "📋 Service Information:"
echo "  Name: $SERVICE_NAME"
echo "  Location: $INSTALLED_PLIST"
echo "  Logs: $PROJECT_DIR/logs/"
echo ""
echo "🔧 Useful Commands:"
echo ""
echo "  View logs:"
echo "    tail -f $PROJECT_DIR/logs/service.log"
echo ""
echo "  View errors:"
echo "    tail -f $PROJECT_DIR/logs/service.error.log"
echo ""
echo "  Check status:"
echo "    launchctl list | grep $SERVICE_NAME"
echo ""
echo "  Stop service:"
echo "    launchctl unload $INSTALLED_PLIST"
echo ""
echo "  Start service:"
echo "    launchctl load $INSTALLED_PLIST"
echo ""
echo "  Restart service:"
echo "    launchctl unload $INSTALLED_PLIST && launchctl load $INSTALLED_PLIST"
echo ""
echo "  Uninstall service:"
echo "    launchctl unload $INSTALLED_PLIST && rm $INSTALLED_PLIST"
echo ""
echo "==========================================="
echo "The service will now start automatically"
echo "when you restart your Mac!"
echo "==========================================="
echo ""
echo "💡 Want helpful aliases?"
echo ""
echo "Install shell shortcuts with:"
echo "  ./install-aliases.sh"
echo ""
echo "This gives you commands like:"
echo "  relay-logs, relay-status, relay-test, etc."
echo ""
echo "See QUICK_COMMANDS.md for the cheat sheet!"
echo ""
