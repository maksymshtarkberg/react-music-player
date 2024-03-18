import express from "express";
import { changeName, getUser } from "../controllers/userController.js";
const router = express.Router();

router.get('/user', getUser)
router.patch("/changename", changeName); //change name route


export default router;
