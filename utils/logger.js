// const { createLogger, format, transports } = require("winston");

// const logger = createLogger({
//   level: "info",
//   format: format.combine(
//     format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     format.errors({ stack: true }),
//     format.splat(),
//     format.json()
//   ),
//   transports: [
//     new transports.Console({
//       format: format.combine(format.colorize(), format.simple()),
//     }),
//     new transports.File({ filename: "logs/error.log", level: "error" }),
//     new transports.File({ filename: "logs/combined.log" }),
//   ],
// });

// module.exports = logger;

const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
  )
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),

    new DailyRotateFile({
      filename: path.join(__dirname, "../logs/%DATE%.log"),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: false,
      maxFiles: "24h", // ⏳ Keep only the last 24 hours
      utc: true,
    }),
  ],
});

module.exports = logger;
