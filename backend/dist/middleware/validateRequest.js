"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Return friendly validation error
                res.status(400).json({
                    success: false,
                    field: error.errors[0].path.join('.'),
                    message: error.errors[0].message
                });
                return;
            }
            res.status(500).json({ success: false, message: 'Internal server validation error' });
        }
    };
};
exports.validateRequest = validateRequest;
