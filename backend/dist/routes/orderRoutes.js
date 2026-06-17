"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const discountController_1 = require("../controllers/discountController");
const miscController_1 = require("../controllers/miscController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/validate-discount', authMiddleware_1.optionalUser, discountController_1.validateDiscount);
router.post('/', authMiddleware_1.optionalUser, orderController_1.createOrder);
router.get('/my-orders', authMiddleware_1.verifyUser, orderController_1.getMyOrders);
router.get('/:id', authMiddleware_1.optionalUser, orderController_1.getOrderById);
router.post('/:id/cancel', authMiddleware_1.verifyUser, miscController_1.cancelOrder);
exports.default = router;
