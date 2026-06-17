"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("./config/database"));
async function createAdmin() {
    const email = 'admin@auriq.com';
    const password = 'password123';
    const existing = await database_1.default.admin.findUnique({ where: { email } });
    if (existing) {
        console.log(`Admin ${email} already exists.`);
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await database_1.default.admin.create({
        data: {
            first_name: 'Auriq',
            last_name: 'Admin',
            email,
            password: hashedPassword
        }
    });
    console.log(`Created admin: ${email} with password: ${password}`);
}
createAdmin()
    .catch(e => console.error(e))
    .finally(() => database_1.default.$disconnect());
