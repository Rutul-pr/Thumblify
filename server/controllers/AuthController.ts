import { Request, Response } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { signAuthToken } from '../utils/authToken.js';

/** Required on serverless (e.g. Vercel): persist session to Mongo before sending the response. */
const jsonAfterSessionSave = (
    req: Request,
    res: Response,
    body: { message: string; user: { _id: unknown; name: string; email: string } }
) => {
    req.session.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
        }
        const token = signAuthToken(String(body.user._id));
        return res.json({ ...body, token });
    });
};

// Controllers for User Registration (Sign Up)
export const registerUser = async (req:Request,res:Response)=>{
    try {
        const {name,email,password} = req.body

        // finding user by email (if already exist or not)
        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({message:'User Already Exists'})
        }

        //if user does not exists, then we will encrypt the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({name,email,password:hashedPassword})

        await newUser.save()

        // setting user data in session
        req.session.isLoggedIn = true
        req.session.userId = newUser._id

        jsonAfterSessionSave(req, res, {
            message:'Account Created Successfully',
            user:{
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email
            }
        })

    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
}

// controller function for managing User Login
export const loginUser = async (req:Request,res:Response)=>{

    try {
        const {email,password} = req.body

        // finding user by email (if already exist or not)
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message:'User Does not Exists'})
        }

        // if user mail available then checcking whether the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({message:'Invalid Password'})
        }


        // setting user data in session (it means that now this user is logged in)
        req.session.isLoggedIn = true
        req.session.userId = user._id

        jsonAfterSessionSave(req, res, {
            message:'Login Successful',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email
            }
        })
        
    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
    }

}

// Controller function for user Log out
export const logoutUser = async (req:Request,res:Response)=>{
    req.session.destroy((error:any)=>{
        if (error) {
            console.log(error);
            return res.status(500).json({message:error.message})
        }
        return res.json({message:'Logout Successful'})
    })
}

// controller function to verify whether the user exists or not
export const verifyUser = async (req:Request,res:Response)=>{

    try {
        const {userId} = req.session;

        const user = await User.findById(userId).select('-password')

        if (!user) {
            return res.status(400).json({message:'Invalid User'})
        }
        return res.json({ user })
    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
    }

}