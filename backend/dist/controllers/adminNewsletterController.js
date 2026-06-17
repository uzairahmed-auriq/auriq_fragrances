"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSubscribersCSV = exports.deleteSubscriber = exports.getSubscribers = void 0;
const database_1 = __importDefault(require("../config/database"));
const auditLog_1 = require("../utils/auditLog");
const getSubscribers = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 50));
        const [total, subscribers] = await Promise.all([
            database_1.default.newsletterSubscriber.count(),
            database_1.default.newsletterSubscriber.findMany({
                orderBy: { subscribed_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            })
        ]);
        res.json({
            success: true,
            data: subscribers,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('GET SUBSCRIBERS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getSubscribers = getSubscribers;
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await database_1.default.newsletterSubscriber.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) {
            res.status(404).json({ success: false, message: 'Subscriber not found' });
            return;
        }
        await database_1.default.newsletterSubscriber.delete({
            where: { id: parseInt(id) }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'DELETE_SUBSCRIBER', 'NewsletterSubscriber', existing.id, existing, null);
        res.json({ success: true, message: 'Subscriber deleted successfully' });
    }
    catch (error) {
        console.error('DELETE SUBSCRIBER ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteSubscriber = deleteSubscriber;
const exportSubscribersCSV = async (req, res) => {
    try {
        const subscribers = await database_1.default.newsletterSubscriber.findMany({
            orderBy: { subscribed_at: 'desc' }
        });
        // Create CSV content
        const headers = ['ID', 'Email', 'Discount Sent', 'Subscribed At'];
        const rows = subscribers.map(sub => [
            sub.id,
            sub.email,
            sub.discount_sent ? 'Yes' : 'No',
            sub.subscribed_at.toISOString()
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
        res.send(csvContent);
    }
    catch (error) {
        console.error('EXPORT SUBSCRIBERS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.exportSubscribersCSV = exportSubscribersCSV;
