/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "prisma/config";

const isDev = process.env.NODE_ENV === "development";

const dbUrl = isDev
  ? process.env.DATABASE_URL_LOCAL
  : process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    `Missing ${
      isDev ? "DATABASE_URL_LOCAL" : "DATABASE_URL"
    } for NODE_ENV=${process.env.NODE_ENV}`
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});
