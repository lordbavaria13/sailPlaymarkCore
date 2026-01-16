import Joi from "joi";


export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    username: Joi.string().example("HomerSimpson"),
    password: Joi.string().example("secret").required(),
  })
  .or("username", "email")
  .label("UserCredentials");

  export const UserSpec = UserCredentialsSpec.keys({
  email: Joi.string().email().example("homer@simpson.com").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus")

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const AuthResponseSpec = Joi.object()
  .keys({
    success: Joi.boolean().required().example(true),
    token: Joi.string().required().example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  })
  .label("AuthResponse");

export const CommentSpec = Joi.object()
  .keys({
    text: Joi.string().required().min(3).example("Great spot!"),
    rating: Joi.number().required().min(1).max(5).example(5),
  })
  .label("Comment");

export const DetailSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Tower"),
    latitude: Joi.number().optional().example(51.5),
    longitude: Joi.number().optional().example(-0.1),
    description: Joi.string().allow("").required().example("Tall tower"),
    category: Joi.string().valid("marina", "anchorage", "beach", "other").lowercase().optional().example("marina"),
    private: Joi.boolean().optional().example(true),
  })
  .label("Detail");

    export const DetailSpecPlus = DetailSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("DetailPlus");

export const DetailsArray = Joi.array().items(DetailSpecPlus).label("DetailsArray");

export const PlacemarkSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("My Placemark"),
    userId: IdSpec.optional().example("d0f3f2b8-1234-4c2c-9d9d-abcdefabcdef"),
    images: Joi.array().items(Joi.string()).optional().example(["https://example.com/a.jpg"]),
    private: Joi.boolean().optional().example(true),
     category: Joi.string().valid("marina", "anchorage", "beach", "other").lowercase().optional().example("marina"),
  })
  .label("Placemark");

  export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkPlus");

export const PlacemarkArray = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");