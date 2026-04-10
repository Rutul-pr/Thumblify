import express from "express";
import protect from "../middlewares/auth.js";
import { submitGuestContact, submitUserContact } from "../controllers/ContactController.js";

const ContactRouter = express.Router();

ContactRouter.post("/guest", submitGuestContact);
ContactRouter.post("/user", protect, submitUserContact);

export default ContactRouter;
