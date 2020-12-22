const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env.SECRET_KEY || require("../config");

module.exports = (context) => {
  // recupération du header d'authorisation
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    // récupération du token
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        // validation du token
        const user = jwt.verify(token, SECRET_KEY);

        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token should be 'Bearer <token>'");
  }
  throw new Error("Authorization header must be provided");
};
