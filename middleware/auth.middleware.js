const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
