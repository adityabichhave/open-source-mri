import express from "express";
import { scanRepository } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", scanRepository);

export default router;