import mongoose from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ContactMessageSchema = new mongoose.Schema<IContactMessage>({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    subject: { type: String, required: true, trim: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    userId: { type: String, ref: "User" }
}, { timestamps: true });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
