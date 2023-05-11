import express from "express";
import multer from "multer";
import sendSeekable from "send-seekable";

import {
  addSong,
  deleteSong,
  getSongFile,
  getSongByIndex,
} from "../controllers/songController.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", upload.single("file"), addSong);
router.delete("/delete/:id", deleteSong);
router.get("/:id/file", getSongFile);
router.get("/:index/listen", sendSeekable, getSongByIndex);

export default router;
