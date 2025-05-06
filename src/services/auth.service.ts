import prisma from '../lib/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (email: string, password: string, name: string) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error('User not found');

  const isValidPassword = await bcryptjs.compare(password, user.password);
  if (!isValidPassword) throw new Error('Invalid password');

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};
