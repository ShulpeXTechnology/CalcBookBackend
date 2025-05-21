const express = require("express");
const app = express();
const cors = require("cors");
const purchaseRoutes = require("./routes/invoice.routes");
const categoryRoutes = require("./routes/category.routes");
const authRoutes = require("./routes/auth.routes");
const morgan = require("morgan");
const logger = require("./utils/logger");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
app.use(cors());
app.use(express.json());

// Log all HTTP requests using winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Routes
app.use("/api", authRoutes);

// Purchase
app.use("/api", purchaseRoutes);

// Categories
app.use("/api", categoryRoutes);

// Create a route to get the logs
// http://localhost:3001/api/logs

// app.get("/api/logs", (req, res) => {
//   try {
//     const logDirectory = path.join(__dirname, "../logs"); // adjust the path if needed
//     const logFiles = fs.readdirSync(logDirectory);

//     // Sort files by date, so the latest ones are first
//     const sortedFiles = logFiles.sort((a, b) => b.localeCompare(a));

//     // Get the latest log file
//     const latestLogFile = sortedFiles[0]; // Adjust if needed based on your naming convention
//     const logFilePath = path.join(logDirectory, latestLogFile);

//     const logs = fs.readFileSync(logFilePath, "utf-8");

//     res.json({ logs });
//   } catch (err) {
//     logger.error("Error reading log file:", err);
//     res.status(500).json({ message: "Error reading logs" });
//   }
// });

app.get("/api/logs", (req, res) => {
  try {
    const logDirectory = path.join(__dirname, "logs");
    const logFiles = fs.readdirSync(logDirectory);

    // Sort files by date
    const sortedFiles = logFiles.sort((a, b) => b.localeCompare(a));

    // Pagination: Get logs from a specific file and limit number of lines
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const pageSize = 100; // Number of lines per page

    const latestLogFile = sortedFiles[0]; // Latest log file
    const logFilePath = path.join(logDirectory, latestLogFile);

    const logs = fs.readFileSync(logFilePath, "utf-8").split("\n");
    const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize);

    res.json({ logs: paginatedLogs });
  } catch (err) {
    logger.error("Error reading log file:", err);
    res.status(500).json({ message: "Error reading logs" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
