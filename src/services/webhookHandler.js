const { sendGroupMessage } = require("./imessageSender");
const { validatePhoneNumbers } = require("../utils");

const handleWebhook = async (req, res) => {
  try {
    const {
      message,
      phoneNumbers: requestPhoneNumbers,
      groupKeyword,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message payload is required" });
    }

    let phoneNumbers = [];

    // If groupKeyword is provided, phone numbers are optional (used only for fallback)
    if (groupKeyword) {
      console.log(`🎯 Group chat mode: phone numbers are optional (used for fallback)`);
      
      // Still try to get phone numbers for fallback, but don't require them
      if (
        requestPhoneNumbers &&
        Array.isArray(requestPhoneNumbers) &&
        requestPhoneNumbers.length > 0
      ) {
        phoneNumbers = requestPhoneNumbers;
        console.log(
          `📱 Using phone numbers from request for fallback: ${phoneNumbers.join(", ")}`
        );
      } else if (process.env.PHONE_NUMBERS) {
        phoneNumbers = process.env.PHONE_NUMBERS.split(",").map((num) =>
          num.trim()
        );
        console.log(
          `📱 Using phone numbers from environment for fallback: ${phoneNumbers.join(", ")}`
        );
      } else {
        console.log(`⚠️  No phone numbers provided for fallback - group chat must exist`);
      }
    } else {
      // No groupKeyword - phone numbers are required
      if (
        requestPhoneNumbers &&
        Array.isArray(requestPhoneNumbers) &&
        requestPhoneNumbers.length > 0
      ) {
        phoneNumbers = requestPhoneNumbers;
        console.log(
          `📱 Using phone numbers from request: ${phoneNumbers.join(", ")}`
        );
      } else if (process.env.PHONE_NUMBERS) {
        phoneNumbers = process.env.PHONE_NUMBERS.split(",").map((num) =>
          num.trim()
        );
        console.log(
          `📱 Using phone numbers from environment: ${phoneNumbers.join(", ")}`
        );
      } else {
        return res.status(400).json({
          error:
            "Phone numbers are required when no groupKeyword is provided. Provide them in the request body or set PHONE_NUMBERS environment variable.",
        });
      }
    }

    // Validate phone numbers if any are provided
    if (phoneNumbers.length > 0) {
      const validation = validatePhoneNumbers(phoneNumbers);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }
      phoneNumbers = validation.phoneNumbers; // Use validated numbers
    }

    // Send message - if groupKeyword is provided, it will try to send to existing group chat first
    await sendGroupMessage(phoneNumbers, message, groupKeyword);

    res.status(200).json({
      success: true,
      message: groupKeyword
        ? `Message sent to group chat: ${groupKeyword}`
        : "Group message sent successfully",
      recipients: phoneNumbers.length || "group chat",
      phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : null,
      groupChat: groupKeyword || null,
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleWebhook };
