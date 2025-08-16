const { exec } = require("child_process");

const sendMessage = (phoneNumber, message) => {
  return new Promise((resolve, reject) => {
    console.log(`Sending message to ${phoneNumber}: "${message}"`);

    const appleScript = `
      tell application "Messages"
        send "${message}" to buddy "${phoneNumber}" of (service 1 whose service type is iMessage)
      end tell
    `;

    exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `Error sending message to ${phoneNumber}: ${error.message}`
        );
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(`✅ Message sent successfully to ${phoneNumber}: ${stdout}`);
      resolve(stdout);
    });
  });
};

const sendGroupMessage = (phoneNumbers, message) => {
  return new Promise((resolve, reject) => {
    console.log(
      `Sending group message to ${phoneNumbers.length} recipients: "${message}"`
    );

    // Create a comma-separated list of phone numbers for the AppleScript
    const phoneList = phoneNumbers.map((num) => `"${num}"`).join(", ");

    const appleScript = `
      tell application "Messages"
        set groupChat to (chat id of (make new group chat with participants {${phoneList}}))
        send "${message}" to groupChat
      end tell
    `;

    exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error sending group message: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(
        `✅ Group message sent successfully to ${phoneNumbers.length} recipients: ${stdout}`
      );
      resolve(stdout);
    });
  });
};

module.exports = { sendMessage, sendGroupMessage };
