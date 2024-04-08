import express from "express";
import multer from "multer";
import sendSeekable from "send-seekable";

import {
  addSong,
  deleteSong,
  getSongByIndex,
} from "../controllers/songController.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const upload = multer({ dest: "uploads/" }).fields([
  { name: "songFile", maxCount: 1 },
  { name: "albumCover", maxCount: 1 },
]);

const router = express.Router();

router.post(
  "/upload",
  upload,
  //  uploadMiddleware("songs"), Problem with multiple deleting of temporary files
  addSong
);
router.delete("/delete/:id", deleteSong);
router.get("/:index/listen", sendSeekable, getSongByIndex);

export default router;
