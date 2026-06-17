"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutOtherDevices = exports.updatePassword = exports.updateProfile = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("../utils/cloudinary");
const prisma = new client_1.PrismaClient();
const getProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                profile_image_url: true,
                last_login: true,
                created_at: true,
            }
        });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        const sessions = await prisma.adminRefreshToken.findMany({
            where: { admin_id: adminId },
            orderBy: { last_active: 'desc' },
            select: {
                id: true,
                device_info: true,
                browser: true,
                ip_address: true,
                last_active: true,
                created_at: true
            }
        });
        res.json({
            success: true,
            data: {
                admin,
                sessions
            }
        });
    }
    catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { first_name, last_name, email, phone } = req.body;
        const file = req.file;
        let profile_image_url;
        if (file) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'auriq_admin');
            profile_image_url = uploadResult.secure_url;
        }
        const updateData = {
            first_name,
            last_name,
            email,
            phone
        };
        if (profile_image_url) {
            updateData.profile_image_url = profile_image_url;
        }
        // Prevent duplicate email check
        if (email) {
            const existing = await prisma.admin.findFirst({
                where: { email, id: { not: adminId } }
            });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Email is already in use by another admin' });
            }
        }
        const updatedAdmin = await prisma.admin.update({
            where: { id: adminId },
            data: updateData,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                profile_image_url: true,
                last_login: true,
            }
        });
        res.json({ success: true, data: updatedAdmin, message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { current_password, new_password } = req.body;
        if (!current_password || !new_password) {
            return res.status(400).json({ success: false, message: 'Current and new password required' });
        }
        if (new_password.length < 8) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
        }
        const admin = await prisma.admin.findUnique({ where: { id: adminId } });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        const isValid = await bcrypt_1.default.compare(current_password, admin.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }
        const hashedPassword = await bcrypt_1.default.hash(new_password, 10);
        await prisma.admin.update({
            where: { id: adminId },
            data: { password: hashedPassword }
        });
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Error updating admin password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password' });
    }
};
exports.updatePassword = updatePassword;
const logoutOtherDevices = async (req, res) => {
    try {
        const adminId = req.admin.id;
        // In a real scenario, you'd want to spare the current session's token.
        // For simplicity, if we get the current token from headers, we can preserve it.
        const authHeader = req.headers.authorization;
        let currentToken = '';
        // Wait, the auth token is access token, but we are storing refresh tokens.
        // Let's just delete all refresh tokens that haven't been active in the last 15 minutes,
        // or we can pass the active session ID from the frontend to NOT delete.
        const { keep_session_id } = req.body;
        if (keep_session_id) {
            await prisma.adminRefreshToken.deleteMany({
                where: {
                    admin_id: adminId,
                    id: { not: keep_session_id }
                }
            });
        }
        else {
            // Deletes all sessions except the most recently active one as a fallback
            const mostRecent = await prisma.adminRefreshToken.findFirst({
                where: { admin_id: adminId },
                orderBy: { last_active: 'desc' }
            });
            if (mostRecent) {
                await prisma.adminRefreshToken.deleteMany({
                    where: {
                        admin_id: adminId,
                        id: { not: mostRecent.id }
                    }
                });
            }
        }
        res.json({ success: true, message: 'Other sessions terminated' });
    }
    catch (error) {
        console.error('Error terminating sessions:', error);
        res.status(500).json({ success: false, message: 'Failed to terminate sessions' });
    }
};
exports.logoutOtherDevices = logoutOtherDevices;
