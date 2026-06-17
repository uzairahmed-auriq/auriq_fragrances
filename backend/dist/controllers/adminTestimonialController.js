"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getAllTestimonials = void 0;
const client_1 = require("@prisma/client");
const auditLog_1 = require("../utils/auditLog");
const prisma = new client_1.PrismaClient();
const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: testimonials });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllTestimonials = getAllTestimonials;
const createTestimonial = async (req, res) => {
    try {
        const { customer_name, content, rating, is_featured, is_approved } = req.body;
        const adminId = req.admin.id;
        const testimonial = await prisma.testimonial.create({
            data: {
                customer_name,
                content,
                rating: Number(rating),
                is_featured: is_featured === true || is_featured === 'true',
                is_approved: is_approved === true || is_approved === 'true'
            }
        });
        await (0, auditLog_1.logAdminAction)(adminId, 'CREATE_TESTIMONIAL', 'Testimonial', testimonial.id, null, testimonial);
        res.json({ success: true, data: testimonial, message: 'Testimonial created' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create testimonial' });
    }
};
exports.createTestimonial = createTestimonial;
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_name, content, rating, is_featured, is_approved } = req.body;
        const adminId = req.admin.id;
        const existing = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } });
        const testimonial = await prisma.testimonial.update({
            where: { id: parseInt(id) },
            data: {
                customer_name,
                content,
                rating: rating !== undefined ? Number(rating) : undefined,
                is_featured: is_featured !== undefined ? (is_featured === true || is_featured === 'true') : undefined,
                is_approved: is_approved !== undefined ? (is_approved === true || is_approved === 'true') : undefined
            }
        });
        await (0, auditLog_1.logAdminAction)(adminId, 'UPDATE_TESTIMONIAL', 'Testimonial', testimonial.id, existing, testimonial);
        res.json({ success: true, data: testimonial, message: 'Testimonial updated' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update testimonial' });
    }
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.admin.id;
        const existing = await prisma.testimonial.findUnique({ where: { id: parseInt(id) } });
        await prisma.testimonial.delete({ where: { id: parseInt(id) } });
        await (0, auditLog_1.logAdminAction)(adminId, 'DELETE_TESTIMONIAL', 'Testimonial', parseInt(id), existing, null);
        res.json({ success: true, message: 'Testimonial deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
    }
};
exports.deleteTestimonial = deleteTestimonial;
