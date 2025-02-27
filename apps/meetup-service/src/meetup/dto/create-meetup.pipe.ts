import * as Joi from 'joi';

export const CreateMeetupSchema = Joi.object({
  title: Joi.string().min(1).required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  date: Joi.date().required(),
  tags: Joi.array().items(Joi.string()).optional(),
});
