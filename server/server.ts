import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRoute.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import ContactRouter from './routes/ContactRoutes.js';
import AdminRouter from './routes/AdminRoutes.js';

declare module 'express-session' {
    interface SessionData {
        isLoggedIn:boolean;
        userId:string
    }
}

await connectDB()

const app = express();

const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true;
    const fromEnv = (process.env.CLIENT_URL ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const allowed = new Set(['http://localhost:5173', 'http://localhost:3000', ...fromEnv]);
    if (allowed.has(origin)) return true;
    try {
        const { hostname } = new URL(origin);
        if (hostname === 'localhost' || hostname.endsWith('.vercel.app')) return true;
    } catch {
        return false;
    }
    return false;
};

// Middlewares — credentials + exact Origin reflection (required for cross-site session cookies)
app.use(
    cors({
        origin(origin, callback) {
            if (isAllowedOrigin(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true,
    })
);

app.set('trust proxy',1)

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none': 'lax',
        path:'/'
    }, 
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URI as string,
        collectionName:'sessions'
    })
}))

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send("Rutul's Server is Live!");
});
app.use('/api/auth',AuthRouter)
app.use('/api/thumbnail',ThumbnailRouter)
app.use('/api/user',UserRouter)
app.use('/api/contact',ContactRouter)
app.use('/api/admin',AdminRouter)


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});