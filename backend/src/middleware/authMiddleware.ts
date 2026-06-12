import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AdminAuthRequest extends Request {
  admin?: {
    id: number;
    email: string;
  };
}

export interface UserAuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const verifyAdmin = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;

    if (decoded.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      return;
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const verifyUser = (req: UserAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const optionalUser = (req: UserAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
    }
  } catch (error) {
    // Ignore error, treat as guest
  }
  next();
};
