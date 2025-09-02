import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/api-error.js";

// middleware to check accessToken, fallback to refreshToken
const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;

    // check Access Token (from Authorization header)
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // attach user info to request
            req.user = decoded;
            return next();
        } catch (err) {
            // access token expired or invalid → fallback to refresh
            console.log("Access token invalid/expired, trying refresh...");
        }
    }

    // check refresh Token (from cookies)
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return next(new ApiError(401, "Unauthorized: No token provided"));
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded._id);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        // check if DB has the same refreshToken (single login session)
        if (user.refreshToken !== refreshToken) {
            return next(new ApiError(403, "Invalid session. Please login again."));
        }

        // generate new Access Token
        const newAccessToken = user.generateAccessToken();

        // attach new access token to header for client
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        // attach user info to request
        req.user = {
            _id: user._id,
            email: user.email,
        };
        return next();
    } catch (err) {
        return next(new ApiError(403, "Invalid or expired refresh token"));
    }
};

export default isLoggedIn;