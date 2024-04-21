import express from "express";
import protectRoute from "../middleware/protectRoute.js"
import { getDecrMsg } from "../controllers/decrMsg.controller.js";
const router = express.Router();
router.post("/",protectRoute,getDecrMsg);
export default router;