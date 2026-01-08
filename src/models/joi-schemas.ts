import Joi from "joi";


export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object()
  .keys({
    username: Joi.string().example("HomerSimpson").required(),
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const UserCredentialsSpec = Joi.object()
  .keys({
    username: Joi.string().example("HomerSimpson").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const DetailsSpec = Joi.object()
  .keys({
    title: Joi.string().example("Tower").required(),
    latitude: Joi.number().example("51.5").required(),
    longitude: Joi.number().example("-0.1").required(),
    description: Joi.string().allow("").example("Tall tower").required(),
    // categories/images are optional CSV strings provided by the edit form
    categories: Joi.string().allow("").example("marina, beach").optional(),
    images: Joi.string().allow("").example("https://example.com/a.jpg, https://example.com/b.jpg").optional(),
  })
  .label("Detail");

export const DetailsArray = Joi.array().items(DetailsSpec).label("DetailsArray");

export const PlacemarkSpec = Joi.object()
  .keys({
    title: Joi.string().example("My Placemark").required(),
  })
  .label("Placemark");

export const PlacemarkArray = Joi.array().items(PlacemarkSpec).label("PlacemarkArray");

// API payload/response shapes (used for Swagger + API route validation)
export const DetailApiSpec = Joi.object()
  .keys({
    pmId: IdSpec.required().example("d0f3f2b8-1234-4c2c-9d9d-abcdefabcdef"),
    latitude: Joi.number().required().example(51.5),
    longitude: Joi.number().required().example(-0.1),
    title: Joi.string().required().example("Tower"),
    description: Joi.string().allow("").required().example("Tall tower"),
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("DetailApi");

export const DetailApiArray = Joi.array().items(DetailApiSpec).label("DetailApiArray");

export const PlacemarkApiSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("My Placemark"),
    userId: IdSpec.required().example("d0f3f2b8-1234-4c2c-9d9d-abcdefabcdef"),
    categories: Joi.array().items(Joi.string()).optional().example(["marina", "beach"]),
    images: Joi.array().items(Joi.string()).optional().example(["https://example.com/a.jpg"]),
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("PlacemarkApi");

export const PlacemarkApiArray = Joi.array().items(PlacemarkApiSpec).label("PlacemarkApiArray");