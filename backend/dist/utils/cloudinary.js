"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadToCloudinary = (buffer, folder = 'auriq') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
            format: 'webp',
            transformation: [
                { width: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        }, (error, result) => {
            if (result)
                resolve(result);
            else
                reject(error);
        });
        uploadStream.end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
