"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storyController_1 = require("../controllers/storyController");
const router = (0, express_1.Router)();
router.get('/', storyController_1.getStory);
exports.default = router;
