const { sendGroupMessage } = require("./imessageSender");
const { validatePhoneNumbers } = require("../utils");

const handleWebhook = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message payload is required" });
    }

    const phoneNumbers = process.env.PHONE_NUMBERS.split(",").map((num) =>
      num.trim()
    );

    // Validate phone numbers
    const validation = validatePhoneNumbers(phoneNumbers);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Send group message instead of individual messages
    await sendGroupMessage(validation.phoneNumbers, message);

    res.status(200).json({
      success: true,
      message: "Group message sent successfully",
      recipients: validation.phoneNumbers.length,
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleWebhook };
