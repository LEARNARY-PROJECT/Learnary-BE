// file: prisma.config.ts

// 1. Phải import "dotenv/config" để tải biến môi trường một cách tường minh
import "dotenv/config"; 
import { defineConfig, env } from "prisma/config";

// 2. Định nghĩa cấu hình
export default defineConfig({
  schema: "prisma/schema.prisma",
  
  // 3. Định nghĩa chuỗi kết nối (url) cho các lệnh CLI tại đây
  datasource: {
    url: env("DATABASE_URL_LOCAL"),
  },
});