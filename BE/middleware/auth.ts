import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'unauthorized' });
  }
};

export const adminAuthentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  await authentication(req, res, async () => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'forbidden' });
    }
    next();
  });
};
