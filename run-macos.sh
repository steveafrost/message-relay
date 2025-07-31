#!/bin/bash

# Script to run the message relay service directly on macOS
# This allows direct access to the Messages app without Docker

echo "Starting Message Relay Service on macOS..."
echo "This will have direct access to the Messages app"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your PHONE_NUMBERS"
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Check if PHONE_NUMBERS is set
if [ -z "$PHONE_NUMBERS" ]; then
    echo "Error: PHONE_NUMBERS not set in .env file!"
    exit 1
fi

echo "Phone numbers configured: $PHONE_NUMBERS"
echo "Starting server on http://localhost:3000"
echo "Press Ctrl+C to stop"

# Run the service
node src/server.js 