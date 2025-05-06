import { Request, Response } from 'express';
import { createUser, getUsers, getUserById, deleteUser } from '../services/user.service';
import { JwtPayload } from '../middlewares/auth.middleware';

export const create = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const newUser = await createUser(email, password, name);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user.' });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

export const getById = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = req.params.id;

    // Check if the user has permission to view other user's data
    const requestUser: JwtPayload = req.user!;
    if (requestUser.role !== 'ADMIN' && requestUser.id !== userId) {
        return res.status(403).json({ message: 'Forbidden: You cannot access this user data' });
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

export const deleteUserByID = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const deletedUser = await deleteUser(userId);
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
}