import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const verifyUser = (req, res, next) => {
    // Avoid logging sensitive data such as access token
    const token = req.cookies.access_token;

    // Return an error if token is not present
    if (!token) {
        return next(errorHandler(401, "Unauthorized: Token is missing"));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Provide more details on the error, but don't expose too much info
            return next(errorHandler(401, "Unauthorized: Invalid token"));
        }

        // Attach the user object to the request
        req.user = user;
        next();
    });
};
