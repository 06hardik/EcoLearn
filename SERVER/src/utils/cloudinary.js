import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return result;
  }
  catch(error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath) //removes the locally saved temporary file as file could be malacious etc..
    return null
  }
};

export {uploadToCloudinary}
