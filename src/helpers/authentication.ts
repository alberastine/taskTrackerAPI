// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'No token. Access denied.' });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || ''
        ) as jwt.JwtPayload;
        // Attach decoded data (like user ID) to the request object
        (req as any).user = decoded;
        next(); // Pass control to the next middleware/route handler
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
        return;
    }
};
