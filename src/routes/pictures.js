import express from "express";
import imageController from "../controllers/imageController.js";

const router = express.Router();

router.get("/api/upload", imageController.getImageAsBase64);
router.post("/api/download", imageController.downloadImage);

export default router;
