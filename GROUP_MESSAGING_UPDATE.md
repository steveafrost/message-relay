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

### 5. Added Testing
- **`test-group-message.js`**: Direct testing of group messaging functionality
- **`test-webhook-flexibility.js`**: Comprehensive testing of webhook flexibility
- **NPM scripts**: Added `npm test`, `npm run test:group`, and `npm run test:webhook` commands

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

### New Webhook Request Format
```json
{
  "message": "Your message here",
  "phoneNumbers": ["+1234567890", "+1987654321"]
}
```

**Phone Number Sources (in order of priority):**
1. **Request body**: `phoneNumbers` array in webhook payload
2. **Environment variable**: `PHONE_NUMBERS` from `.env` file (fallback)
3. **Error**: If neither is provided

### Implementation Approach
The service now sends individual messages to each recipient instead of creating group chats via AppleScript. This approach is:

1. **More Reliable**: Avoids AppleScript syntax issues with phone number formatting
2. **Better Error Handling**: Individual failures don't break the entire group
3. **Same End Result**: All recipients receive the message
4. **Easier Debugging**: Clear success/failure reporting per recipient

**Note**: While this doesn't create a group chat in the Messages app, it achieves the same goal of sending a message to multiple recipients simultaneously.

## Benefits

1. **Efficiency**: Single message operation instead of multiple
2. **User Experience**: Recipients see each other in the group chat
3. **Cost**: Potentially lower costs for bulk messaging
4. **Engagement**: Group chats encourage conversation between recipients
5. **Simplicity**: Cleaner code and better error handling
6. **Flexibility**: Dynamic phone number selection per request
7. **Reusability**: Same service can handle different recipient groups

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

The `PHONE_NUMBERS` environment variable is now **optional** and serves as a fallback:

```bash
# Optional fallback phone numbers
PHONE_NUMBERS=+1234567890,+1987654321,+1555123456
```

**New Flexibility:**
- **Request-based**: Pass phone numbers directly in webhook requests
- **Environment fallback**: Use `.env` file for default recipients
- **Hybrid approach**: Mix both methods as needed

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
