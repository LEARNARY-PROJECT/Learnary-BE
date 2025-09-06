import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Learning Platform API",
      version: "1.0.0",
      description: "API for the Learning Platform",
    },
    servers: [
      {
        //Nhớ dùng cổng đúng khi chạy trong Docker hoặc localhost
        url: `${process.env.BASE_URL || "http://localhost:4000"}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Course: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            thumbnail: { type: "string" },
            price: { type: "number" },
            instructorId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Lesson: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            videoUrl: { type: "string" },
            thumbnail: { type: "string" },
            courseId: { type: "string" },
            order: { type: "integer" },
            content: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Enrollment: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            courseId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Feedback: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            courseId: { type: "string" },
            rating: { type: "integer" },
            comment: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            role: { type: "string", enum: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    isDev
      ? path.resolve(__dirname, "../routes/*.ts") // src/routes trong môi trường dev
      : path.resolve(__dirname, "../routes/*.js"), // dist/routes trong production
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
