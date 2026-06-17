"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.updateOrderStatus = exports.getAllOrders = void 0;
const database_1 = __importDefault(require("../config/database"));
const auditLog_1 = require("../utils/auditLog");
const getAllOrders = async (req, res) => {
    try {
        const orders = await database_1.default.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: true,
                address: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.error('GET ALL ORDERS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await database_1.default.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        await (0, auditLog_1.logAdminAction)(req.admin.id, 'UPDATE_ORDER_STATUS', 'Order', order.id, null, { status });
        res.json({ success: true, data: order });
    }
    catch (error) {
        console.error('UPDATE ORDER STATUS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const getDashboardStats = async (req, res) => {
    try {
        const [totalOrders, totalCustomers, totalProducts, pendingOrders, recentOrders, totalRevenueData] = await Promise.all([
            database_1.default.order.count(),
            database_1.default.user.count(),
            database_1.default.product.count({ where: { is_active: true } }),
            database_1.default.order.count({ where: { status: 'PENDING' } }),
            database_1.default.order.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                    items: true
                }
            }),
            database_1.default.order.aggregate({
                _sum: { total: true },
                where: { payment_status: 'PAID' }
            })
        ]);
        const totalRevenue = totalRevenueData._sum.total || 0;
        res.json({
            success: true,
            data: {
                total_orders: totalOrders,
                total_customers: totalCustomers,
                total_products: totalProducts,
                pending_orders: pendingOrders,
                total_revenue: totalRevenue,
                recent_orders: recentOrders
            }
        });
    }
    catch (error) {
        console.error('DASHBOARD STATS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
