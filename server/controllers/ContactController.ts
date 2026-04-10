import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage.js";
import User from "../models/User.js";

const validatePayload = (name: string, email: string, subject: string, message: string) => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        return "All fields are required";
    }
    if (message.trim().length < 10) {
        return "Message should be at least 10 characters";
    }
    return null;
};

export const submitGuestContact = async (req: Request, res: Response) => {
    try {
        const { name = "", email = "", subject = "", message = "" } = req.body;
        const validationError = validatePayload(name, email, subject, message);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        await ContactMessage.create({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        });

        return res.json({ message: "Thanks! We received your message and will get back to you soon." });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export const submitUserContact = async (req: Request, res: Response) => {
    try {
        const { subject = "", message = "" } = req.body;
        const { userId } = req.session;

        const user = await User.findById(userId).select("name email");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validationError = validatePayload(user.name, user.email, subject, message);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        await ContactMessage.create({
            userId,
            name: user.name,
            email: user.email,
            subject: subject.trim(),
            message: message.trim()
        });

        return res.json({ message: "Message sent successfully. Our team will contact you on your registered email." });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllContactMessages = async (_req: Request, res: Response) => {
    try {
        const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
        return res.json({ messages });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};
