"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const adRoutes_1 = __importDefault(require("./routes/adRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const miscRoutes_1 = __importDefault(require("./routes/miscRoutes"));
const storyRoutes_1 = __importDefault(require("./routes/storyRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/ads', adRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/wishlist', wishlistRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/story', storyRoutes_1.default);
app.use('/api', miscRoutes_1.default);
// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Auriq API is running' });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
const database_1 = __importDefault(require("./config/database"));
app.listen(env_1.ENV.PORT, async () => {
    try {
        console.log('Running auto-migrations for session_id...');
        await database_1.default.$executeRawUnsafe(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id TEXT;`);
        await database_1.default.$executeRawUnsafe(`ALTER TABLE carts ADD COLUMN IF NOT EXISTS session_id TEXT;`);
        await database_1.default.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS carts_session_id_key ON carts(session_id);`);
        await database_1.default.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS carts_session_id_idx ON carts(session_id);`);
        await database_1.default.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS orders_session_id_idx ON orders(session_id);`);
        console.log('Auto-migration complete.');
    }
    catch (error) {
        console.error('Auto-migration failed:', error);
    }
    console.log(`Server running on port ${env_1.ENV.PORT}`);
});
