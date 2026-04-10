import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.session;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            return res.status(500).json({ message: "ADMIN_EMAIL is not configured" });
        }

        const user = await User.findById(userId).select("email");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.email.toLowerCase() !== adminEmail.toLowerCase()) {
            return res.status(403).json({ message: "Only admin can access this resource" });
        }

        next();
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export default adminOnly;
