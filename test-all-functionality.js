#!/usr/bin/env node

const http = require("http");

const BASE_URL = "http://localhost:3000";

// Test scenarios covering all functionality
const testScenarios = [
  {
    name: "🎯 Group Chat - Existing Group",
    payload: {
      message: "🧪 Testing group chat functionality!",
      phoneNumbers: ["+13133650246", "+16127072757"],
      groupKeyword: "Work Team",
    },
    description: "Sends message to existing group chat (if found)",
  },
  {
    name: "🎯 Group Chat - Non-existent Group (Fallback)",
    payload: {
      message: "🧪 Testing fallback to individual messages!",
      phoneNumbers: ["+13133650246", "+16127072757"],
      groupKeyword: "NonExistentGroup",
    },
    description: "Falls back to individual messages when group not found",
  },
  {
    name: "📱 Multiple Recipients - No Group",
    payload: {
      message: "🧪 Testing multiple recipients without group!",
      phoneNumbers: ["+13133650246", "+16127072757"],
    },
    description: "Sends individual messages to multiple recipients",
  },
  {
    name: "📱 Single Recipient",
    payload: {
      message: "🧪 Testing single recipient!",
      phoneNumbers: ["+13133650246"],
    },
    description: "Sends to single recipient",
  },
  {
    name: "🌍 Environment Fallback",
    payload: {
      message: "🧪 Testing environment variable fallback!",
    },
    description: "Uses PHONE_NUMBERS from .env file",
  },
  {
    name: "❌ Missing Message Validation",
    payload: {
      phoneNumbers: ["+13133650246"],
    },
    description: "Tests error handling for missing message",
  },
  {
    name: "❌ Invalid Phone Number Validation",
    payload: {
      message: "🧪 Testing invalid phone numbers!",
      phoneNumbers: ["invalid-number", "+16127072757"],
    },
    description: "Tests validation of phone number format",
  },
];

async function testWebhook(scenario) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(scenario.payload);

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/webhook",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            response: response,
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            response: { error: "Invalid JSON response" },
            success: false,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("🧪 Testing All Message Relay Functionality\n");
  console.log("This comprehensive test covers:");
  console.log("✅ Group chat support (existing groups)");
  console.log("✅ Fallback to individual messages");
  console.log("✅ Multiple recipient messaging");
  console.log("✅ Single recipient messaging");
  console.log("✅ Environment variable fallback");
  console.log("✅ Error handling and validation\n");

  for (const scenario of testScenarios) {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`📋 ${scenario.name}`);
    console.log(`📝 ${scenario.description}`);
    console.log(`${"=".repeat(70)}`);

    try {
      const result = await testWebhook(scenario);

      if (result.success) {
        console.log("✅ SUCCESS");
        console.log(`📊 Status: ${result.statusCode}`);
        console.log(`📱 Recipients: ${result.response.recipients}`);
        if (result.response.groupChat) {
          console.log(`🎯 Group Chat: ${result.response.groupChat}`);
        }
        console.log(`📋 Response: ${JSON.stringify(result.response, null, 2)}`);
      } else {
        console.log("❌ FAILED");
        console.log(`📊 Status: ${result.statusCode}`);
        console.log(`📋 Response: ${JSON.stringify(result.response, null, 2)}`);
      }
    } catch (error) {
      console.log("💥 ERROR");
      console.log(`📋 Error: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("🏁 Testing completed!");
  console.log("=".repeat(70));

  console.log("\n💡 Key Features Demonstrated:");
  console.log("\n🎯 Group Chat Support:");
  console.log("   - Send to existing group chats by name");
  console.log("   - Automatic fallback if group not found");
  console.log("   - True group messaging (not individual messages)");

  console.log("\n📱 Flexible Recipient Options:");
  console.log("   - Custom phone numbers in request");
  console.log("   - Environment variable fallback");
  console.log("   - Single or multiple recipients");

  console.log("\n🔄 Smart Fallback System:");
  console.log("   - Group chat first (if keyword provided)");
  console.log("   - Individual messages as fallback");
  console.log("   - Always ensures message delivery");

  console.log("\n🔍 How to Use Group Chats:");
  console.log("   1. Find your group chat name in Messages app");
  console.log("   2. Use part of the name as groupKeyword");
  console.log("   3. Send messages and they appear in the group!");

  console.log("\n📖 Example Commands:");
  console.log("\n# Send to existing group chat:");
  console.log("curl -X POST http://localhost:3000/webhook \\");
  console.log('  -H "Content-Type: application/json" \\');
  console.log(
    '  -d \'{"message": "Hello team!", "groupKeyword": "Work Team"}\''
  );

  console.log("\n# Send to multiple recipients (no group):");
  console.log("curl -X POST http://localhost:3000/webhook \\");
  console.log('  -H "Content-Type: application/json" \\');
  console.log(
    '  -d \'{"message": "Hello!", "phoneNumbers": ["+1234567890"]}\''
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWebhook, runTests };
