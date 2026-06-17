"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalUser = exports.verifyUser = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_ACCESS_SECRET);
        if (decoded.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
            return;
        }
        req.admin = {
            id: decoded.id,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};
exports.verifyAdmin = verifyAdmin;
const verifyUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_ACCESS_SECRET);
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};
exports.verifyUser = verifyUser;
const optionalUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_ACCESS_SECRET);
            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
        }
    }
    catch (error) {
        // Ignore error, treat as guest
    }
    next();
};
exports.optionalUser = optionalUser;
