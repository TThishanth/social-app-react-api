import express from "express";
import { getRelationships, addRelationship, removeRelationship } from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.post("/add", addRelationship);
router.delete("/remove", removeRelationship);
 
export default router;