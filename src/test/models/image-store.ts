import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret,
});

export const imageStore = {
  getAllImages: async function() {
    const result = await cloudinary.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile: any) {
    try {
      const result = await cloudinary.uploader.upload(imagefile, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      return result.url;
    } catch (error) {
        console.log(error);
        return null;
    }
  },

  deleteImage: async function(id: string) {
    await cloudinary.uploader.destroy(id, {});
  },
};
