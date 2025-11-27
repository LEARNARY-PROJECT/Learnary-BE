import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const isDevelopment = process.env.NODE_ENV === 'development';
const connectionString = isDevelopment 
  ? process.env.DATABASE_URL_LOCAL  // Dev: dùng local
  : process.env.DATABASE_URL;       // Production: dùng Heroku Url
if (!connectionString) {
  throw new Error(
    `DATABASE_URL${isDevelopment ? '_LOCAL' : ''} is not defined in environment variables`
  );
}

const pool = new Pool({
  connectionString,
  ssl: isDevelopment 
    ? false  // Local không cần SSL
    : { rejectUnauthorized: false },  // Heroku yêu cầu SSL
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter: adapter,
    log: isDevelopment 
      ? ['error', 'warn']  // Dev: log queries
      : ['error'],  // Production: chỉ log errors
  });
};
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;


const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (isDevelopment) {
  globalThis.prismaGlobal = prisma;
}

export default prisma;