import express from "express";
import multer from "multer";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";
import { uploadBanner } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/banner", isAuthenticated, authorizeRoles("organiser", "admin"), upload.single("banner"), uploadBanner);

export default router;
