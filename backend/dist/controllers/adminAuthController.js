"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const env_1 = require("../config/env");
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await database_1.default.admin.findUnique({ where: { email } });
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isValid = await bcrypt_1.default.compare(password, admin.password);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: 'ADMIN' }, env_1.ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: admin.id, role: 'ADMIN' }, env_1.ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        // Extract device/browser/IP info
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        let browser = 'Unknown Browser';
        if (userAgent.includes('Firefox'))
            browser = 'Firefox';
        else if (userAgent.includes('Chrome'))
            browser = 'Chrome';
        else if (userAgent.includes('Safari'))
            browser = 'Safari';
        else if (userAgent.includes('Edge'))
            browser = 'Edge';
        const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP');
        try {
            await database_1.default.adminRefreshToken.create({
                data: {
                    token: refreshToken,
                    admin_id: admin.id,
                    device_info: userAgent.substring(0, 255),
                    browser,
                    ip_address: ipAddress,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
            // Update last login
            await database_1.default.admin.update({
                where: { id: admin.id },
                data: { last_login: new Date() }
            });
        }
        catch (dbError) {
            console.warn('Could not save refresh token to DB or update last_login, skipping:', dbError);
        }
        res.json({
            success: true,
            data: {
                admin: {
                    id: admin.id,
                    first_name: admin.first_name,
                    last_name: admin.last_name,
                    email: admin.email,
                    profile_image_url: admin.profile_image_url
                },
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('ADMIN LOGIN ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.adminLogin = adminLogin;
