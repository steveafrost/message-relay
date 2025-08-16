#!/usr/bin/env node

const { sendGroupMessage } = require("./src/services/imessageSender");

async function testGroupMessage() {
  try {
    console.log("🧪 Testing group message functionality...");

    // Test phone numbers (replace with actual numbers for testing)
    const testPhoneNumbers = ["+1234567890", "+1987654321"];
    const testMessage = "🧪 This is a test group message from the updated app!";

    console.log(
      `📱 Sending group message to ${testPhoneNumbers.length} recipients:`
    );
    testPhoneNumbers.forEach((num, index) => {
      console.log(`   ${index + 1}. ${num}`);
    });
    console.log(`💬 Message: "${testMessage}"`);

    // Send the group message
    const result = await sendGroupMessage(testPhoneNumbers, testMessage);

    console.log("✅ Group message test completed successfully!");
    console.log("📋 Result:", result);
  } catch (error) {
    console.error("❌ Group message test failed:", error.message);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGroupMessage();
}

module.exports = { testGroupMessage };
