const { sendMessage } = require('./imessageSender');

const handleWebhook = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    const phoneNumbers = process.env.PHONE_NUMBERS.split(',');

    for (const number of phoneNumbers) {
      await sendMessage(number.trim(), message);
    }

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { handleWebhook };