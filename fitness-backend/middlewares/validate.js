// middleware/validate.js
module.exports = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const first = err.issues?.[0];
    res.status(400).json({
      message: first?.message || "Invalid input",
      field: first?.path?.[0] || null,
    });
  }
};
