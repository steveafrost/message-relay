const { exec } = require("child_process");

const validatePhoneNumber = (number) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return phoneRegex.test(number);
};

const validatePhoneNumbers = (phoneNumbers) => {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    return { isValid: false, error: "Phone numbers must be a non-empty array" };
  }

  const invalidNumbers = phoneNumbers.filter(
    (num) => !validatePhoneNumber(num.trim())
  );

  if (invalidNumbers.length > 0) {
    return {
      isValid: false,
      error: `Invalid phone numbers: ${invalidNumbers.join(", ")}`,
    };
  }

  return { isValid: true, phoneNumbers: phoneNumbers.map((num) => num.trim()) };
};

const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

module.exports = {
  validatePhoneNumber,
  validatePhoneNumbers,
  logMessage,
};
