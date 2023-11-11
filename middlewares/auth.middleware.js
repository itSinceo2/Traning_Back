const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');

module.exports.isAuthenticated = (req, res, next) => {
  const authorization = req.header('Authorization');
  console.log(authorization);

  if (authorization) {
    const [type, token] = authorization.split(' ');

    if (type === 'Bearer') {
      if (token) {
        // Validate token
        jwt.verify(token, process.env.JWT_SECRET || 'Super secret', (err, decodedToken) => {
          if (err) { // Invalid token or expired
            next(err);
          } else {
            req.currentUser = decodedToken.id;
            next(); // All good!
          }
        })
      } else {
        next(createError(StatusCodes.UNAUTHORIZED, 'Token error'));
      }
    } else {
      next(createError(StatusCodes.UNAUTHORIZED, 'Bearer error'));
    }
  } else {
    next(createError(StatusCodes.UNAUTHORIZED, 'No auth'));
  }
}