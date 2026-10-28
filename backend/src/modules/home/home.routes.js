import express from "express";
import { getHomePage } from "./home.controller.js";

const router = express.Router();

router.get("/", getHomePage);

export default router;