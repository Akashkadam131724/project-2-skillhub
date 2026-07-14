import { Router } from "express";
import { globalSearch } from "./search.controller.js";

const router = Router();

router.get("/", globalSearch);

export default router;
