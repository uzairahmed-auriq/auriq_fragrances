"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessageStatus = exports.getMessages = void 0;
const database_1 = __importDefault(require("../config/database"));
const auditLog_1 = require("../utils/auditLog");
const getMessages = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const [total, messages] = await Promise.all([
            database_1.default.contactMessage.count(),
            database_1.default.contactMessage.findMany({
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            })
        ]);
        res.json({
            success: true,
            data: messages,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('GET MESSAGES ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getMessages = getMessages;
const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, is_read } = req.body;
        const existing = await database_1.default.contactMessage.findUnique({ where: { id: parseInt(id) } });
        const message = await database_1.default.contactMessage.update({
            where: { id: parseInt(id) },
            data: {
                ...(status && { status }),
                ...(is_read !== undefined && { is_read })
            }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_MESSAGE_STATUS', 'ContactMessage', message.id, existing, message);
        res.json({ success: true, data: message });
    }
    catch (error) {
        console.error('UPDATE MESSAGE STATUS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateMessageStatus = updateMessageStatus;
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await database_1.default.contactMessage.findUnique({ where: { id: parseInt(id) } });
        await database_1.default.contactMessage.delete({
            where: { id: parseInt(id) }
        });
        if (existing) {
            await (0, auditLog_1.logAdminAction)(req.admin.id, 'DELETE_MESSAGE', 'ContactMessage', existing.id, existing, null);
        }
        res.json({ success: true, message: 'Message deleted' });
    }
    catch (error) {
        console.error('DELETE MESSAGE ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteMessage = deleteMessage;
