import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dz5pykylb",
  api_key: 371795247512934,
  api_secret: "JpOajL1LCafH6IL_FljcZM5XNTw"
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
