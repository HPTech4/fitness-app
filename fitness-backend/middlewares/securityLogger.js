// middleware/securityLogger.js
const fs = require("fs");
const path = require("path");

// Log file location
const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "security.log");

// Ensure log dir exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logEvent(event, data = {}) {
  const timestamp = new Date().toISOString();
  const ip = data.ip || "unknown";
  const line = `[${timestamp}] [${event}] ip=${ip} ${JSON.stringify(
    Object.fromEntries(Object.entries(data).filter(([k]) => k !== "ip")),
  )}\n`;

  // Console (for dev)
  console.log(`🔒 SECURITY: ${event}`, data);

  // File (for audit)
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error("Failed to write security log:", err);
  });
}

// Express middleware to log failed auth attempts and suspicious activity
function securityMiddleware(req, res, next) {
  // Log after the response to capture status codes
  res.on("finish", () => {
    const ip = req.ip || req.connection?.remoteAddress || "unknown";
    const status = res.statusCode;

    // Log suspicious responses
    if (status === 401 || status === 403) {
      logEvent("AUTH_DENIED", {
        ip,
        method: req.method,
        path: req.originalUrl,
        status,
      });
    } else if (status === 429) {
      logEvent("RATE_LIMITED", {
        ip,
        method: req.method,
        path: req.originalUrl,
      });
    } else if (status === 400 && req.originalUrl.includes("/auth/")) {
      logEvent("AUTH_BAD_REQUEST", {
        ip,
        method: req.method,
        path: req.originalUrl,
        body: sanitizeBody(req.body),
      });
    }
  });

  next();
}

// Remove sensitive fields before logging
function sanitizeBody(body) {
  if (!body || typeof body !== "object") return body;
  const sanitized = { ...body };
  if (sanitized.password) sanitized.password = "***REDACTED***";
  if (sanitized.token) sanitized.token = "***REDACTED***";
  return sanitized;
}

module.exports = { securityMiddleware, logEvent };
