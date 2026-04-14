import { Request,Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import User from "../models/User.js";

// controller function to get all user thumbnails
export const getUserThumbnails = async(req:Request,res:Response)=>{
    try {

        const {userId} = req.session

        const thumbnails = await Thumbnail.find({userId}).sort({createdAt:-1})
        res.json({thumbnails})
    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}


// controller function to get a single thumbnail of a user
export const getThumbnailById = async(req:Request,res:Response)=>{
    try {

        const {userId} = req.session
        const {id} = req.params

        const thumbnail = await Thumbnail.findOne({userId,_id:id})
        res.json({thumbnail})
        
    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

// controller function to get current logged-in user profile
export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ user });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// controller function to update current logged-in user profile
export const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { name } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name: name.trim() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
