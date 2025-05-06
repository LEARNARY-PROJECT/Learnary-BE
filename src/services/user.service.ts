import bcryptjs from 'bcryptjs';
import prisma from '../lib/client';

// Tạo user mặc định nếu không có ít nhất 1 user có role ADMIN
export const createDefaultUserIfNoneExists = async () => {
    const userCount = await prisma.user.count();

    // Kiểm tra xem đã có ít nhất 1 user có role ADMIN hay chưa
    const adminCount = await prisma.user.count({
        where: {
            role: 'ADMIN',
        },
    });
    // Kiểm tra nếu không có user nào
    if (userCount === 0 || adminCount === 0) {
        const hashedPassword = await bcryptjs.hash('admin123', 10); // Mật khẩu mặc định
        await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });
        console.log('Default admin user created');
        return;
    }
};

export const createUser = async (email: string, password: string, name: string) => {
    const user = await prisma.user.create({
        data: {
            email,
            password,
            name,
        },
    });
    return user;
};

export const getUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });
    return user;
};

export const deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
        where: {
            id,
        },
    });
    return user;
}
