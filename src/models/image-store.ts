import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}

export const imageStore = {
  getAllImages: async function() {
    configureCloudinary();
    const result = await cloudinary.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile: any) {
    configureCloudinary();
    try {
      const result = await cloudinary.uploader.upload(imagefile, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      return result.secure_url;
    } catch (error) {
        console.log(error);
        return null;
    }
  },

  deleteImage: async function(id: string) {
    configureCloudinary();
    await cloudinary.uploader.destroy(id, {});
  },
};
