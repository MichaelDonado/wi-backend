import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB_HOST: Joi.string().required(),
  APP_PORT: Joi.string().required(),
  JWT_SECRET: Joi.required(),
  WI_API: Joi.string().required(),
  PUBLIC_KEY: Joi.string().required(),
});

