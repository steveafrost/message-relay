# Group Messaging Update

## Overview
Updated the message-relay service to send group messages instead of individual messages to each phone number. This creates a single group chat and sends one message to all recipients simultaneously.

## Changes Made

### 1. Enhanced iMessage Sender (`src/services/imessageSender.js`)
- **Added `sendGroupMessage()` function**: Creates a group chat and sends a single message to all participants
- **Kept `sendMessage()` function**: For backward compatibility and individual messaging if needed
- **AppleScript Integration**: Uses Messages app's group chat functionality to create `{phone1, phone2, ...}` groups

### 2. Updated Webhook Handler (`src/services/webhookHandler.js`)
- **Replaced individual message loop**: No more sending messages one by one
- **Added phone number validation**: Ensures all phone numbers are valid before sending
- **Group message response**: Returns success status and recipient count
- **Error handling**: Better validation and error messages

### 3. Enhanced Utilities (`src/utils/index.js`)
- **Added `validatePhoneNumbers()` function**: Validates arrays of phone numbers
- **Input validation**: Checks for empty arrays and invalid phone number formats
- **Clean phone numbers**: Trims whitespace from phone numbers

### 4. Updated Documentation (`README.md`)
- **Feature updates**: Added group messaging to feature list
- **API response changes**: Updated response format to show recipient count
- **Service component updates**: Noted group messaging support

### 5. Added Testing (`test-group-message.js`)
- **Test script**: Direct testing of group messaging functionality
- **NPM scripts**: Added `npm test` and `npm run test:group` commands

## How It Works

### Before (Individual Messages)
```javascript
// Old approach - sent individual messages
for (const number of phoneNumbers) {
  await sendMessage(number.trim(), message);
}
```

### After (Group Messages)
```javascript
// New approach - creates group chat and sends one message
await sendGroupMessage(validation.phoneNumbers, message);
```

### AppleScript Group Chat Creation
```applescript
tell application "Messages"
  set groupChat to (chat id of (make new group chat with participants {"+1234567890", "+1987654321"}))
  send "Your message" to groupChat
end tell
```

## Benefits

1. **Efficiency**: Single message operation instead of multiple
2. **User Experience**: Recipients see each other in the group chat
3. **Cost**: Potentially lower costs for bulk messaging
4. **Engagement**: Group chats encourage conversation between recipients
5. **Simplicity**: Cleaner code and better error handling

## Testing

### Run the Test
```bash
npm test
# or
npm run test:group
```

### Test via Webhook
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Testing group messaging!"}'
```

## Environment Variables

No changes to environment variables required. The existing `PHONE_NUMBERS` format works:
```bash
PHONE_NUMBERS=+1234567890,+1987654321,+1555123456
```

## Backward Compatibility

- **Individual messaging**: Still available via `sendMessage()` function
- **API endpoints**: No changes to webhook endpoint
- **Environment setup**: Same configuration required
- **Docker deployment**: No changes needed

## Future Enhancements

1. **Persistent Groups**: Save group chat IDs to avoid recreating groups
2. **Group Management**: Add/remove participants from existing groups
3. **Message History**: Track messages sent to specific groups
4. **Group Templates**: Pre-configured groups for different use cases
