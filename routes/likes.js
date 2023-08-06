import express from "express";
import { getLikes, addLike, removeLike } from "../controllers/like.js";

const router = express.Router();

router.get("/", getLikes);
router.post("/add", addLike);
router.delete("/remove", removeLike);
 
export default router;