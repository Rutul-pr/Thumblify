import jwt from 'jsonwebtoken';

const getSecret = (): string => {
    const s = process.env.SESSION_SECRET;
    if (!s) {
        throw new Error('SESSION_SECRET is required');
    }
    return s;
};

export const signAuthToken = (userId: string): string => {
    return jwt.sign({ sub: userId }, getSecret(), { expiresIn: '7d' });
};

export const verifyAuthToken = (token: string): { userId: string } | null => {
    try {
        const decoded = jwt.verify(token, getSecret()) as jwt.JwtPayload;
        if (!decoded.sub) return null;
        return { userId: String(decoded.sub) };
    } catch {
        return null;
    }
};
