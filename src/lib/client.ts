import { PrismaClient } from '@prisma/client';
import config from '../config/prisma.config';
const prisma = new PrismaClient({
    datasources:config.datasources,
});
export default prisma;