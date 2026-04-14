import express from 'express';
import { changeMyPassword, getMyProfile, getThumbnailById, getUserThumbnails, updateMyProfile } from '../controllers/UserController.js';
import protect from '../middlewares/auth.js';

const UserRouter = express.Router()

UserRouter.get('/thumbnails',protect,getUserThumbnails)
UserRouter.get('/thumbnail/:id',protect,getThumbnailById)
UserRouter.get('/profile', protect, getMyProfile)
UserRouter.put('/profile', protect, updateMyProfile)
UserRouter.put('/change-password', protect, changeMyPassword)

export default UserRouter

