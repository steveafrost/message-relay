const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(number);
};

const logMessage = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};

module.exports = {
    validatePhoneNumber,
    logMessage,
};