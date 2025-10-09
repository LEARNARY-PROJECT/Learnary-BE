import { Request, RequestHandler, Response } from 'express';
import { createUser, getAllUsers, getUserById, deleteUser } from '../services/user.service';
import { JwtPayload } from '../middlewares/auth.middleware';

export const create = async (req: Request, res: Response) => {
    try {
        const { email, password, fullname } = req.body;
        const newUser = await createUser(email, password, fullname);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Get user by id error", err);
        res.status(500).json({ error: 'Failed to create user.' });
    }
};

export const getAll = async (_req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error("Get user by id error", err);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

export const getById: RequestHandler = async (req,res) => {
    const userId = req.params.id;
    // Check role 
    const requestUser: JwtPayload = req.user!;
    if (requestUser.role !== 'ADMIN' && requestUser.id !== userId) {
        res.status(403).json({ message: 'Forbidden: You cannot access this user data' });
        return
    }
    try {
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return
        }
         res.status(200).json(user);
    } catch (err) {
        console.error("Get user by id error", err);
         res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

export const deleteUserByID = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const deletedUser = await deleteUser(userId);
        res.status(200).json(deletedUser);
    } catch (err) {
        console.error("Get user by id error", err);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
}