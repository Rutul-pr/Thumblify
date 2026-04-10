import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../utils/authToken.js';

const protect = async (req: Request, res: Response, next: NextFunction) => {
    let { isLoggedIn, userId } = req.session;

    if (!isLoggedIn || !userId) {
        const raw = req.headers.authorization;
        const token = raw?.startsWith('Bearer ') ? raw.slice(7).trim() : null;
        if (token) {
            const parsed = verifyAuthToken(token);
            if (parsed) {
                req.session.isLoggedIn = true;
                req.session.userId = parsed.userId;
                isLoggedIn = true;
                userId = parsed.userId;
            }
        }
    }

    if (!isLoggedIn || !userId) {
        return res.status(401).json({ message: 'You are not logged in' });
    }

    next();
};

export default protect;