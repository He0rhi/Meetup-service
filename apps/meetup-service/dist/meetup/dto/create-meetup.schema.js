"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMeetupSchema = void 0;
const Joi = require("joi");
exports.CreateMeetupSchema = Joi.object({
    title: Joi.string().min(1).required(),
    location: Joi.string().min(1).required(),
    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required(),
});
