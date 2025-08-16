#!/usr/bin/env node

const http = require("http");

const BASE_URL = "http://localhost:3000";

// Test data
const testScenarios = [
  {
    name: "📱 Custom Phone Numbers in Request",
    payload: {
      message: "🧪 Test message with custom recipients!",
      phoneNumbers: ["+1234567890", "+1987654321"],
    },
    description: "Sends message to specific phone numbers provided in request",
  },
  {
    name: "🌍 Environment Variable Fallback",
    payload: {
      message: "🧪 Test message using environment phone numbers!",
    },
    description: "Sends message using PHONE_NUMBERS from .env file",
  },
  {
    name: "❌ Missing Message Validation",
    payload: {
      phoneNumbers: ["+1234567890"],
    },
    description: "Tests error handling for missing message",
  },
  {
    name: "❌ Invalid Phone Number Validation",
    payload: {
      message: "🧪 Test message with invalid phone numbers!",
      phoneNumbers: ["invalid-number", "+1987654321"],
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
  console.log("🧪 Testing Webhook Flexibility\n");
  console.log("This test demonstrates the new phone number flexibility:\n");
  console.log("1. Custom phone numbers in request body");
  console.log("2. Environment variable fallback");
  console.log("3. Validation and error handling\n");

  for (const scenario of testScenarios) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📋 ${scenario.name}`);
    console.log(`📝 ${scenario.description}`);
    console.log(`${"=".repeat(60)}`);

    try {
      const result = await testWebhook(scenario);

      if (result.success) {
        console.log("✅ SUCCESS");
        console.log(`📊 Status: ${result.statusCode}`);
        console.log(`📱 Recipients: ${result.response.recipients}`);
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

  console.log("\n" + "=".repeat(60));
  console.log("🏁 Testing completed!");
  console.log("=".repeat(60));

  console.log("\n💡 Usage Examples:");
  console.log("\n1. Custom recipients:");
  console.log("curl -X POST http://localhost:3000/webhook \\");
  console.log('  -H "Content-Type: application/json" \\');
  console.log(
    '  -d \'{"message": "Hello!", "phoneNumbers": ["+1234567890"]}\''
  );

  console.log("\n2. Environment fallback:");
  console.log("curl -X POST http://localhost:3000/webhook \\");
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"message": "Hello!"}\'');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWebhook, runTests };
