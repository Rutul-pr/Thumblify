import express from 'express';
import { getMyProfile, getThumbnailById, getUserThumbnails, updateMyProfile } from '../controllers/UserController.js';
import protect from '../middlewares/auth.js';

const UserRouter = express.Router()

UserRouter.get('/thumbnails',protect,getUserThumbnails)
UserRouter.get('/thumbnail/:id',protect,getThumbnailById)
UserRouter.get('/profile', protect, getMyProfile)
UserRouter.put('/profile', protect, updateMyProfile)

export default UserRouter

