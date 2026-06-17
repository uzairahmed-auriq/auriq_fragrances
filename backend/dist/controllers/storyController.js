"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStory = exports.getStory = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const auditLog_1 = require("../utils/auditLog");
const prisma = new client_1.PrismaClient();
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
const getStory = async (req, res) => {
    try {
        const story = await prisma.story.findUnique({
            where: { id: 1 }
        });
        if (!story) {
            // Return default if not found
            return res.json({
                success: true,
                data: {
                    subtitle: "The Heritage",
                    title: "Crafting The Essence Of Elegance",
                    paragraph1: "Every drop of Auriq is a testament to the art of fine perfumery. We source the rarest, most exquisite ingredients from across the globe—from the fields of Grasse to the deep forests of the East—to create fragrances that are not just scents, but timeless memories.",
                    paragraph2: "Our master perfumers blend traditional techniques with modern innovation, ensuring that every bottle holds a symphony of notes that evolve beautifully on your skin throughout the day.",
                    image1_url: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop",
                    image2_url: null
                }
            });
        }
        res.json({ success: true, data: story });
    }
    catch (error) {
        console.error('Error fetching story:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getStory = getStory;
const updateStory = async (req, res) => {
    try {
        const { subtitle, title, paragraph1, paragraph2, mission_statement, vision_statement, sourcing_details, manufacturing_process, company_values, founder_message, video_url } = req.body;
        // Existing story to get old images if new ones aren't uploaded
        const existingStory = await prisma.story.findUnique({ where: { id: 1 } });
        let image1_url = existingStory?.image1_url || "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop";
        let image2_url = existingStory?.image2_url || null;
        // Handle uploaded images
        const files = req.files;
        const image1File = files?.['image1']?.[0];
        const image2File = files?.['image2']?.[0];
        if (image1File) {
            const result = await (0, cloudinary_1.uploadToCloudinary)(image1File.buffer, 'auriq_story');
            image1_url = result.secure_url;
        }
        if (image2File) {
            const result = await (0, cloudinary_1.uploadToCloudinary)(image2File.buffer, 'auriq_story');
            image2_url = result.secure_url;
        }
        const storyData = {
            subtitle, title, paragraph1, paragraph2,
            image1_url, image2_url,
            mission_statement: mission_statement || null,
            vision_statement: vision_statement || null,
            sourcing_details: sourcing_details || null,
            manufacturing_process: manufacturing_process || null,
            company_values: company_values || null,
            founder_message: founder_message || null,
            video_url: video_url || null,
        };
        const story = await prisma.story.upsert({
            where: { id: 1 },
            update: storyData,
            create: { id: 1, ...storyData }
        });
        await revalidateFrontend('story');
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_STORY', 'Story', 1, existingStory, story);
        res.json({ success: true, data: story, message: 'Story updated successfully' });
    }
    catch (error) {
        console.error('Error updating story:', error);
        res.status(500).json({ success: false, message: 'Failed to update story' });
    }
};
exports.updateStory = updateStory;
