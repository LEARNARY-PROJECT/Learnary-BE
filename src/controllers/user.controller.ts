import { Request, RequestHandler, Response } from 'express';
import {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRoleService,
    editUserInformation,
    UpdateUserData,
    getRecentlyActiveUsers,
    getInactiveUsers,
    uploadAvatarToS3,
    getFullUserProfile,
    getUsersExceptAdmins,
} from '../services/user.service';
import { JwtPayLoad } from '../middlewares/auth.middleware';

export const create = async (req: Request, res: Response) => {
    try {
        const { email, password, fullname } = req.body;
        const newUser = await createUser(email, password, fullname);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Fail to create user", err);
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
export const getUserExceptAdmin = async (_req: Request, res: Response) => {
    try {
        const users = await getUsersExceptAdmins();
        res.status(200).json(users);
    } catch (err) {
        console.error("Get user by id error", err);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};
export const getMyProfile: RequestHandler = async (req, res) => {
    try {
        const userNeedProfileId = req.params.id;
        if (!userNeedProfileId) {
            res.status(404).json({ error: "Not found this user" });
            return;
        }
        const user = await getUserById(userNeedProfileId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Get my profile error:", error);
        res.status(500).json({ error: "Something is error in backend" });
    }
};
export const getById: RequestHandler = async (req, res) => {
    const userId = req.params.id;

    const requestUser: JwtPayLoad = req.jwtPayload!;
    if (requestUser.id !== userId) {
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
        if (!userId) {
            res.status(400).json({ error: 'User ID is required.' });
            return;
        }
        const deletedUser = await deleteUser(userId);
        res.status(200).json(deletedUser);
    } catch (err) {
        console.error("Get user by id error", err);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
}
export const updateUserRole = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { role } = req.body;
    try {
        if (role !== 'ADMIN' && role !== 'INSTRUCTOR' && role !== 'LEARNER') {
            res.status(400).json({ error: 'Invalid role specified.' });
            return;
        }
        const updatedUser = await updateUserRoleService(userId, role);
        res.status(200).json({ updatedUser });
    } catch (err) {
        console.error("Update user role error", err);
        res.status(500).json({ error: 'Failed to update user role.' });
    }
};

export const updateUserInformation: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.id.trim();
        const jwtPayload: JwtPayLoad = req.jwtPayload!;
        const jwtId = jwtPayload.id.trim();
        
        if (jwtId !== userId && jwtPayload.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden: You can only update your own information' });
            return;
        }
        const updateData: UpdateUserData = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            avatar: req.body.avatar,
            bio: req.body.bio,
            city: req.body.city || "",
            country: req.body.country,
            nation: req.body.nation || "",
            dateOfBirth: req.body.dateOfBirth,
        };
        const updatedUser = await editUserInformation(userId, updateData);
        res.status(200).json({
            message: 'User information updated successfully',
            user: updatedUser
        });
    } catch (err) {
        const e = err as Error;
        console.error("Update user information error:", e);
        if (e.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(500).json({ error: 'Failed to update user information' });
    }
};
export const uploadAvatar: RequestHandler = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file selected" });
            return;
        }
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const updatedUser = await uploadAvatarToS3(userId, req.file);
        res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatarUrl: updatedUser.avatar,
            user: updatedUser,
        });
    } catch (error) {
        const e = error as Error;
        console.error('Upload avatar error:', e);
        if (e.message === 'User not found') {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(500).json({ 
            error: 'Server error during upload',
            details: e.message 
        });
    }
};
export const getRecentlyActive: RequestHandler = async (req, res) => {
    try {
        const days = parseInt(req.query.days as string) || 7; //nếu không truyền ngày thì mặc định sẽ là 7 ngày vừa qua
        const users = await getRecentlyActiveUsers(days);

        res.status(200).json({
            message: `Users who logged in within the last ${days} days`,
            count: users.length,
            users,
        });
    } catch (error) {
        const e = error as Error;
        console.error("Get recently active users error:", e);
        res.status(500).json({ error: 'Failed to fetch recently active users' });
    }
};


export const getInactive: RequestHandler = async (req, res) => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const users = await getInactiveUsers(days);

        res.status(200).json({
            message: `Users who haven't logged in for ${days} days or more`,
            count: users.length,
            users,
        });
    } catch (err) {
        const e = err as Error;
        console.error("Get inactive users error:", e);
        res.status(500).json({ error: 'Failed to fetch inactive users' });
    }
};

// API Xem chi tiết Học viên
export const getUserDetailForAdmin: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getFullUserProfile(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        const e = error as Error;
        console.error("Get user detail for admin error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

// API Xem chi tiết Giảng viên
export const getInstructorDetailForAdmin: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getFullUserProfile(id);
        if (!user || !user.instructor) {
            res.status(404).json({ error: "Instructor not found" });
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        const e = error as Error;
        console.error("Get instructor detail for admin error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

