"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAdminAction = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logAdminAction = async (adminId, action, entityType, entityId, previousValue, newValue) => {
    try {
        await prisma.auditLog.create({
            data: {
                admin_id: adminId,
                action,
                entity_type: entityType,
                entity_id: entityId || null,
                previous_value: previousValue ? JSON.stringify(previousValue) : null,
                new_value: newValue ? JSON.stringify(newValue) : null,
            }
        });
    }
    catch (error) {
        console.error('Failed to log admin action:', error);
    }
};
exports.logAdminAction = logAdminAction;
