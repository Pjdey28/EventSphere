import cloudinary from "../config/cloudinary.js";

export const uploadBanner = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Banner image is required" });
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return res.status(503).json({ message: "Cloudinary is not configured" });
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "eventsphere/banners", resource_type: "image" }, (error, value) => error ? reject(error) : resolve(value));
      stream.end(req.file.buffer);
    });
    return res.status(201).json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    return res.status(500).json({ message: "Banner upload failed", error: error.message });
  }
};
