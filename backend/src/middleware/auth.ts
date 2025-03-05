import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the JwtPayload interface
interface JwtPayload {
  id: string;
  role: string;
}

// Custom Request type with user property
interface CustomRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

// Authenticate middleware
export const authenticate: RequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // This should now work with CustomRequest
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorize middleware (returns a RequestHandler)
export const authorize = (roles: string[]): RequestHandler => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user; // Should now work with CustomRequest
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
};