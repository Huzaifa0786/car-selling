const asyncHandler = require("express-async-handler"); // Import the express-async-handler for error handling
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token verification

// Middleware to authenticate users
const Authenticate = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.header.authorization; // Retrieve the authorization header
  
  // Check if the authorization header is present and starts with 'Bearer'
  if (authHeader && authHeader.startsWith("Bearer")) {
    // Extract the token from the authorization header
    token = authHeader.split(" ")[1];

    // Check if the token is missing
    if (!token) {
      res
        .status(401)
        .json({ error: "User is not Authorized or token is missing" }); // Respond with 401 if the token is missing
      throw new Error("User is not Authorized or token is missing");
    }

    try {
      // Verify the token using the secret key from environment variables
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user; // Attach the decoded user information to the request object
      next(); // Call the next middleware or route handler
    } catch (error) {
      res.status(401).json({ error: "User is not Authorized!" }); // Respond with 401 if token verification fails
      throw new Error("User is not Authorized!");
    }
  } else {
    res
      .status(401)
      .json({ error: "User is not Authorized or token is missing!" }); // Respond with 401 if authorization header is missing or not properly formatted
    throw new Error("User is not Authorized or token is missing!");
  }
});

module.exports = Authenticate; // Export the Authenticate middleware
