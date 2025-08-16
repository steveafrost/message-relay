const express = require("express");
const bodyParser = require("body-parser");
const { handleWebhook } = require("./services/webhookHandler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Webhook endpoint
app.post("/webhook", handleWebhook);

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("✅ iMessage service ready - using AppleScript integration");
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      console.error("Error during server shutdown:", err);
      process.exit(1);
    }

    console.log("Server closed successfully");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Listen for shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
