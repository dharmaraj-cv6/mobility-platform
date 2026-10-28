import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, } from "../config/env.js";
export const generateToken = (payload) => {
    const options = {
        expiresIn: JWT_EXPIRES_IN,
    };
    return jwt.sign(payload, JWT_SECRET, options);
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
