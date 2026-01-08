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
  title: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  description: Joi.string().allow("").required(),
  // categories/images are optional CSV strings provided by the edit form
  categories: Joi.string().allow("").optional(),
  images: Joi.string().allow("").optional(),
};

export const PlacemarkSpec = {
  title: Joi.string().required(),
};