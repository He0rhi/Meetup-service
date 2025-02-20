import * as Joi from 'joi';

export const CreateMeetupSchema = Joi.object({
    title: Joi.string().min(1).required(),
    location: Joi.string().min(1).required(),
    date: Joi.date().required(), 
});
