"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const miscController_1 = require("../controllers/miscController");
const router = (0, express_1.Router)();
router.post('/newsletter/subscribe', miscController_1.subscribeNewsletter);
router.post('/contact', miscController_1.submitContact);
router.get('/public/settings', miscController_1.getPublicSettings);
exports.default = router;
