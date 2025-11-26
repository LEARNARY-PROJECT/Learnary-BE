import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL_LOCAL,
});
const adapter = new PrismaPg(pool);
const prismaClientSingleton = () => {
    return new PrismaClient({
        adapter: adapter
    });
};
declare const globalThis: {
    prismaGlobal:ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;