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

module.exports = { sendMessage };
