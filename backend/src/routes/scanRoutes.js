import express from "express";
import {
  scanRepository,
  explainFile
} from "../controllers/scanController.js";

const router = express.Router();

router.post("/", scanRepository);
router.post("/explain", explainFile);

export default router;