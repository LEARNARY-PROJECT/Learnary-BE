import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ error: 'Invalid credentials.' });
  }
};
