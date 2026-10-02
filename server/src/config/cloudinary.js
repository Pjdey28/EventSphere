import { v2 as cloudinary } from "cloudinary";

export const configureCloudinary = () => {
  if (process.env.CLOUDINARY_URL) {
    const connection = new URL(process.env.CLOUDINARY_URL);
    cloudinary.config({
      cloud_name: connection.hostname,
      api_key: decodeURIComponent(connection.username),
      api_secret: decodeURIComponent(connection.password),
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
};

export default cloudinary;
