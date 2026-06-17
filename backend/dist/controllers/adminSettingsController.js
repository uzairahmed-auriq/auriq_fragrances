"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettingsByGroup = void 0;
const client_1 = require("@prisma/client");
const auditLog_1 = require("../utils/auditLog");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const prisma = new client_1.PrismaClient();
const revalidateFrontend = async (tag) => {
    try {
        await axios_1.default.post('http://localhost:3000/api/revalidate', {
            tag,
            secret: env_1.ENV.REVALIDATION_SECRET
        });
    }
    catch (error) {
        console.error('Failed to revalidate frontend cache:', error);
    }
};
const getSettingsByGroup = async (req, res) => {
    try {
        const { group } = req.query;
        let whereClause = {};
        if (group && typeof group === 'string') {
            whereClause = { group };
        }
        const settings = await prisma.systemSetting.findMany({
            where: whereClause
        });
        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
        res.json({ success: true, data: settingsMap });
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getSettingsByGroup = getSettingsByGroup;
const updateSettings = async (req, res) => {
    try {
        const { settings, group } = req.body;
        // settings is an object of { key: value }
        const adminId = req.admin.id;
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ success: false, message: 'Settings must be an object' });
        }
        const updatedKeys = [];
        for (const [key, value] of Object.entries(settings)) {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            const existing = await prisma.systemSetting.findUnique({ where: { key } });
            await prisma.systemSetting.upsert({
                where: { key },
                update: { value: stringValue },
                create: {
                    key,
                    value: stringValue,
                    group: group || 'GENERAL'
                }
            });
            updatedKeys.push(key);
            // Log action
            await (0, auditLog_1.logAdminAction)(adminId, 'UPDATE_SETTING', 'SystemSetting', existing?.id, existing ? { value: existing.value } : null, { value: stringValue });
        }
        // Attempt to revalidate frontends based on updated keys or groups
        if (group) {
            await revalidateFrontend(group.toLowerCase());
        }
        else {
            await revalidateFrontend('settings');
        }
        res.json({ success: true, message: 'Settings updated successfully' });
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
