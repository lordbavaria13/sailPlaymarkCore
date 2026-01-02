import Joi from "joi";

export const UserSpec = {
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserCredentialsSpec = {
  username: Joi.string().required(),
  password: Joi.string().required(),
};

export const DetailsSpec = {
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  description: Joi.number().allow("").optional(),
};

export const PlacemarkSpec = {
  title: Joi.string().required(),
};