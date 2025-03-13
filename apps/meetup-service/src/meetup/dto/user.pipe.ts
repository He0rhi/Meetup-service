import * as Joi from 'joi';

export const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  login: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  login: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
});
