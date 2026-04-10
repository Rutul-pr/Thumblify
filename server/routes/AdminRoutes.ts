import express from "express";
import protect from "../middlewares/auth.js";
import adminOnly from "../middlewares/admin.js";
import { getAllContactMessages } from "../controllers/ContactController.js";

const AdminRouter = express.Router();

AdminRouter.get("/messages", protect, adminOnly, getAllContactMessages);

export default AdminRouter;
