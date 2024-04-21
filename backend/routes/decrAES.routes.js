import express from "express";
import protectRoute from "../middleware/protectRoute.js"
import { getDecrAES } from "../controllers/decrAES.controller.js";
const router = express.Router();
router.post("/:id",protectRoute,getDecrAES);
export default router;