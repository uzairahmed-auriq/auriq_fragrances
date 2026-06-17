"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAdStatus = exports.deleteAd = exports.getAllAds = exports.createAd = void 0;
const database_1 = __importDefault(require("../config/database"));
const cloudinary_1 = require("../utils/cloudinary");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const auditLog_1 = require("../utils/auditLog");
const revalidateFrontend = async (tag) => {
    try {
        await axios_1.default.post(`${env_1.ENV.FRONTEND_URL}/api/revalidate`, {
            tag,
            secret: env_1.ENV.REVALIDATION_SECRET
        });
    }
    catch (error) {
        console.error('Failed to revalidate frontend cache:', error);
    }
};
const createAd = async (req, res) => {
    try {
        const { title, link_url, position, is_active, button_text, sort_order, starts_at, ends_at } = req.body;
        // Using upload.fields() means req.files is a dictionary
        const files = req.files;
        const imageFile = files?.['image']?.[0];
        const mobileImageFile = files?.['mobile_image']?.[0];
        if (!imageFile && position !== 'ANNOUNCEMENT_BAR') {
            res.status(400).json({ success: false, message: 'Image is required for Hero ads' });
            return;
        }
        let secure_url = "";
        if (imageFile) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(imageFile.buffer, 'auriq_ads');
            secure_url = uploadResult.secure_url;
        }
        let mobile_secure_url = null;
        if (mobileImageFile) {
            const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(mobileImageFile.buffer, 'auriq_ads');
            mobile_secure_url = uploadResult.secure_url;
        }
        const ad = await database_1.default.ad.create({
            data: {
                title,
                link_url: link_url || null,
                position,
                is_active: is_active === 'true' || is_active === true,
                image_url: secure_url,
                mobile_image_url: mobile_secure_url,
                button_text: button_text || null,
                sort_order: sort_order ? parseInt(sort_order) : 0,
                starts_at: starts_at ? new Date(starts_at) : null,
                ends_at: ends_at ? new Date(ends_at) : null,
            }
        });
        await revalidateFrontend('ads');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'CREATE_AD', 'Ad', ad.id, null, { title: ad.title });
        res.json({ success: true, data: ad });
    }
    catch (error) {
        console.error('CREATE AD ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createAd = createAd;
const getAllAds = async (req, res) => {
    try {
        const ads = await database_1.default.ad.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: ads });
    }
    catch (error) {
        console.error('GET ALL ADS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllAds = getAllAds;
const deleteAd = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await database_1.default.ad.findUnique({ where: { id: parseInt(id) } });
        await database_1.default.ad.delete({ where: { id: parseInt(id) } });
        await revalidateFrontend('ads');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'DELETE_AD', 'Ad', parseInt(id), existing, null);
        res.json({ success: true, message: 'Ad deleted' });
    }
    catch (error) {
        console.error('DELETE AD ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteAd = deleteAd;
const toggleAdStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const ad = await database_1.default.ad.update({
            where: { id: parseInt(id) },
            data: { is_active: is_active === 'true' || is_active === true }
        });
        await revalidateFrontend('ads');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'TOGGLE_AD_STATUS', 'Ad', ad.id, null, { is_active: ad.is_active });
        res.json({ success: true, data: ad });
    }
    catch (error) {
        console.error('TOGGLE AD ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.toggleAdStatus = toggleAdStatus;
