import express from "express";
import multer from "multer";
import sendSeekable from "send-seekable";

import {
  addSong,
  deleteSong,
  getSongFile,
  getSongByIndex,
  albumCover,
} from "../controllers/songController.js";

const upload = multer({ dest: "uploads/" }).fields([
  { name: 'songFile', maxCount: 1 }, 
  { name: 'albumCover', maxCount: 1 }
]);

const router = express.Router();

router.post("/upload", upload, addSong);
router.delete("/delete/:id", deleteSong);
router.get("/:id/file", getSongFile);
router.get("/:id/cover", albumCover);
router.get("/:index/listen", sendSeekable, getSongByIndex);

export default router;
