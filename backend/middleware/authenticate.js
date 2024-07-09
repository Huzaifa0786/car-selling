const asyncHandler = require("express-async-handler"); // Corrected typo
const jwt = require("jsonwebtoken");

const Authenticate = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.header.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("User is not Authorized or token is missing");
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded.user;
      next();

    } catch (error) {
      res.status(401);
      throw new Error("User is not Authorized");
    }
  } else {
    res.status(401);
    throw new Error("User is not Authorized or token is missing");
  }
});

module.exports = Authenticate;
