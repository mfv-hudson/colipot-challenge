import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  const { email, password, departmentId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashedPassword, departmentId },
  });
  res.json('Ok');
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, secret);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};
