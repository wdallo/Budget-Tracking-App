// notification.js

// Function to send email notification
function sendEmailNotification(email, message) {
  // Implement logic to send email notification using a third-party service or library
  console.log(`Email notification sent to ${email}: ${message}`);
}

// Function to send SMS notification
function sendSMSNotification(phoneNumber, message) {
  // Implement logic to send SMS notification using a third-party service or library
  console.log(`SMS notification sent to ${phoneNumber}: ${message}`);
}

module.exports = { sendEmailNotification, sendSMSNotification };
