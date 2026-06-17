"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.createCategory = void 0;
const database_1 = __importDefault(require("../config/database"));
const auditLog_1 = require("../utils/auditLog");
const createCategory = async (req, res) => {
    try {
        const { name, is_active } = req.body;
        const category = await database_1.default.category.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/ /g, '-'),
                is_active: is_active ?? true
            }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'CREATE_CATEGORY', 'Category', category.id, null, { name: category.name });
        res.json({ success: true, data: category });
    }
    catch (error) {
        console.error('CREATE CATEGORY ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, is_active } = req.body;
        const category = await database_1.default.category.update({
            where: { id: parseInt(id) },
            data: {
                name,
                slug: name ? name.toLowerCase().replace(/ /g, '-') : undefined,
                is_active
            }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_CATEGORY', 'Category', category.id, null, category);
        res.json({ success: true, data: category });
    }
    catch (error) {
        console.error('UPDATE CATEGORY ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateCategory = updateCategory;
