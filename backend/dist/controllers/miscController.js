"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSettings = exports.cancelOrder = exports.submitContact = exports.subscribeNewsletter = void 0;
const database_1 = __importDefault(require("../config/database"));
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email required' });
            return;
        }
        await database_1.default.newsletterSubscriber.upsert({
            where: { email },
            update: {},
            create: { email }
        });
        res.json({ success: true, message: 'Subscribed successfully' });
    }
    catch (error) {
        console.error('NEWSLETTER ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: 'Name, email and message required' });
            return;
        }
        await database_1.default.contactMessage.create({
            data: { name, email, phone, subject, message }
        });
        res.json({ success: true, message: 'Message sent successfully' });
    }
    catch (error) {
        console.error('CONTACT ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.submitContact = submitContact;
const cancelOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const userId = req.user?.id;
        const order = await database_1.default.order.findFirst({
            where: { id: orderId, user_id: userId }
        });
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
            res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
            return;
        }
        await database_1.default.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
        });
        res.json({ success: true, message: 'Order cancelled successfully' });
    }
    catch (error) {
        console.error('CANCEL ORDER ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.cancelOrder = cancelOrder;
const getPublicSettings = async (req, res) => {
    try {
        const { group } = req.query;
        let whereClause = {};
        if (group && typeof group === 'string') {
            whereClause = { group };
        }
        const settings = await database_1.default.systemSetting.findMany({
            where: whereClause
        });
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json({ success: true, data: settingsMap });
    }
    catch (error) {
        console.error('PUBLIC SETTINGS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPublicSettings = getPublicSettings;
