const { exec } = require("child_process");

const sendMessage = (phoneNumber, message) => {
  return new Promise((resolve, reject) => {
    console.log(`Sending message to ${phoneNumber}: "${message}"`);

    // Use AppleScript to send message via Messages app
    const appleScript = `
      tell application "Messages"
        set theService to 1st service whose service type = iMessage
        send "${message}" to buddy "${phoneNumber}" of theService
        return "Message sent to ${phoneNumber}"
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

const sendToGroupChat = (groupKeyword, message) => {
  return new Promise((resolve, reject) => {
    console.log(`Sending message to group chat: "${groupKeyword}"`);

    const appleScript = `
      tell application "Messages"
        set theService to 1st service whose service type = iMessage
        
        -- Find a chat whose name contains the keyword
        set targetChat to missing value
        repeat with c in chats
          try
            set chatName to name of c
          on error
            set chatName to ""
          end try
          if chatName contains "${groupKeyword}" then
            set targetChat to c
            exit repeat
          end if
        end repeat
        
        if targetChat is missing value then
          error "No existing chat found matching: ${groupKeyword}"
        end if
        
        -- Send the message to the group chat
        send "${message}" to targetChat
        return "Message sent to group chat: ${groupKeyword}"
      end tell
    `;

    exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `Error sending to group chat "${groupKeyword}": ${error.message}`
        );
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(
        `✅ Message sent successfully to group chat "${groupKeyword}": ${stdout}`
      );
      resolve(stdout);
    });
  });
};

const sendGroupMessage = (phoneNumbers, message, groupKeyword = null) => {
  return new Promise((resolve, reject) => {
    // Ensure phoneNumbers is always an array
    const safePhoneNumbers = phoneNumbers || [];

    console.log(
      `Sending message to ${safePhoneNumbers.length} recipients: "${message}"`
    );

    // If groupKeyword is provided, try to send to existing group chat first
    if (groupKeyword) {
      console.log(
        `🎯 Attempting to send to existing group chat: "${groupKeyword}"`
      );

      sendToGroupChat(groupKeyword, message)
        .then((result) => {
          console.log(`✅ Successfully sent to group chat: ${result}`);
          resolve(result);
        })
        .catch((error) => {
          console.log(
            `⚠️  Group chat not found, falling back to individual messages: ${error.message}`
          );

          // Only fallback to individual messages if we have phone numbers
          if (safePhoneNumbers && safePhoneNumbers.length > 0) {
            sendIndividualMessages(safePhoneNumbers, message)
              .then(resolve)
              .catch(reject);
          } else {
            // No phone numbers available for fallback
            reject(
              new Error(
                `Group chat "${groupKeyword}" not found and no phone numbers available for fallback`
              )
            );
          }
        });
    } else {
      // No group keyword, phone numbers are required
      if (!safePhoneNumbers || safePhoneNumbers.length === 0) {
        reject(
          new Error(
            "Phone numbers are required when no groupKeyword is provided"
          )
        );
        return;
      }

      // Send individual messages to each recipient
      console.log(`📱 Sending individual messages to multiple recipients`);

      sendIndividualMessages(safePhoneNumbers, message)
        .then(resolve)
        .catch(reject);
    }
  });
};

const sendIndividualMessages = (phoneNumbers, message) => {
  return new Promise((resolve, reject) => {
    console.log(`📱 Falling back to individual messages`);

    const sendPromises = phoneNumbers.map((phoneNumber) =>
      sendMessage(phoneNumber, message).catch((error) => {
        console.error(`Failed to send to ${phoneNumber}: ${error.message}`);
        return { success: false, phoneNumber, error: error.message };
      })
    );

    Promise.allSettled(sendPromises)
      .then((results) => {
        const successful = results.filter(
          (r) => r.status === "fulfilled" && !r.value.error
        ).length;
        const failed = results.filter(
          (r) => r.status === "rejected" || r.value?.error
        ).length;

        console.log(
          `✅ Fallback completed: ${successful} successful, ${failed} failed`
        );

        if (successful > 0) {
          resolve(
            `Message sent via individual messages: ${successful} successful, ${failed} failed`
          );
        } else {
          reject(new Error("Failed to send to any recipients"));
        }
      })
      .catch((error) => {
        console.error(`Error in fallback processing: ${error.message}`);
        reject(error);
      });
  });
};

module.exports = { sendMessage, sendGroupMessage, sendToGroupChat };
