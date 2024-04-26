import express from "express";
import {
  changeEmail,
  changeName,
  getUser,
  uploadAvatar,
} from "../controllers/userController.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.get("/getuser", getUser);
router.put("/changename", changeName);
router.put("/changemail", changeEmail);
router.post("/avatar/upload", upload.single("avatar"), uploadAvatar);

export default router;
