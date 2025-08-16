#!/bin/bash

# Script to run the message relay service directly on macOS
# This allows direct access to the Messages app without Docker

echo "Starting Message Relay Service on macOS..."
echo "This will have direct access to the Messages app"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📱 Phone numbers can be provided in webhook requests instead"
    echo "💡 Or create a .env file with PHONE_NUMBERS for fallback"
else
    # Load environment variables if .env exists
    export $(cat .env | xargs)
    
    # Check if PHONE_NUMBERS is set (optional now)
    if [ -z "$PHONE_NUMBERS" ]; then
        echo "⚠️  Warning: PHONE_NUMBERS not set in .env file"
        echo "📱 Phone numbers can be provided in webhook requests instead"
    else
        echo "✅ Phone numbers configured: $PHONE_NUMBERS"
        echo "💡 These will be used as fallback when no phone numbers in request"
    fi
fi

echo ""
echo "🚀 Starting server on http://localhost:3000"
echo "📡 Webhook endpoint: POST /webhook"
echo ""
echo "🎯 NEW: Group Chat Support Available!"
echo "💡 You can now send messages to existing group chats!"
echo ""
echo "📋 Usage Examples:"
echo ""
echo "1. 🎯 Send to Existing Group Chat:"
echo "   curl -X POST http://localhost:3000/webhook \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"message\": \"Meeting at 6pm!\", \"groupKeyword\": \"Work Team\"}'"
echo ""
echo "2. 📱 Send to Custom Phone Numbers:"
echo "   curl -X POST http://localhost:3000/webhook \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"message\": \"Hello!\", \"phoneNumbers\": [\"+1234567890\"]}'"
echo ""
echo "3. 🌍 Use Environment Fallback:"
echo "   curl -X POST http://localhost:3000/webhook \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"message\": \"Hello!\"}'"
echo ""
echo "4. 🎯 Group Chat + Phone Numbers (for fallback):"
echo "   curl -X POST http://localhost:3000/webhook \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"message\": \"Group message!\", \"phoneNumbers\": [\"+1234567890\"], \"groupKeyword\": \"Weekend Crew\"}'"
echo ""
echo "🔍 To find your group chat names:"
echo "   - Open Messages app"
echo "   - Look at the chat names in the sidebar"
echo "   - Use part of the name as your groupKeyword"
echo ""
echo "Press Ctrl+C to stop"

# Run the service
node src/server.js 