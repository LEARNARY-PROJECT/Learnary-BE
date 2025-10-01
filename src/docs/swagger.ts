import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import fs from "fs";
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
        User: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            avatar: { type: "string" },
            dateOfBirth: { type: "string", format: "date-time" },
            address: { type: "string" },
            city: { type: "string" },
            country: { type: "string" },
            nation: { type: "string" },
            bio: { type: "string" },
            last_login: { type: "string", format: "date-time" },
            isActive: { type: "boolean" },
            password: { type: "string" },
            fullName: { type: "string" },
            role: { type: "string", enum: ["LEARNER", "INSTRUCTOR", "ADMIN"] },
            gender: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Learner: {
          type: "object",
          properties: {
            learner_id: { type: "string" },
            user_id: { type: "string" },
            enrolledAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            createAt: { type: "string", format: "date-time" },
          },
        },
        Instructor: {
          type: "object",
          properties: {
            instructor_id: { type: "string" },
            user_id: { type: "string" },
            isVerified: { type: "boolean" },
            status: { type: "string", enum: ["Active", "Inactive", "Suspended"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Admin: {
          type: "object",
          properties: {
            admin_id: { type: "string" },
            user_id: { type: "string" },
            admin_role_id: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AdminRole: {
          type: "object",
          properties: {
            admin_role_id: { type: "string" },
            role_name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Permission: {
          type: "object",
          properties: {
            permission_id: { type: "string" },
            permission_name: { type: "string" },
            description: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AdminRolePermission: {
          type: "object",
          properties: {
            permission_id: { type: "string" },
            admin_role_id: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AccountSecurity: {
          type: "object",
          properties: {
            account_security_id: { type: "string" },
            user_id: { type: "string" },
            failed_login_attempts: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        InstructorSpecializations: {
          type: "object",
          properties: {
            instructor_specialization_id: { type: "string" },
            instructor_id: { type: "string" },
            specialization_id: { type: "string" },
            admin_id: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Specialization: {
          type: "object",
          properties: {
            specialization_id: { type: "string" },
            instructor_id: { type: "string" },
            specialization_name: { type: "string" },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CitizenIdsConfirm: {
          type: "object",
          properties: {
            citizen_id: { type: "string" },
            instructor_id: { type: "string" },
            citizen_number: { type: "string" },
            date_of_birth: { type: "string", format: "date-time" },
            place_of_birth: { type: "string", format: "date-time" },
            issued_place: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["Pending", "Approved", "Rejected"] },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        InstructorQualifications: {
          type: "object",
          properties: {
            instructor_qualification_id: { type: "string" },
            instructor_id: { type: "string" },
            specialization_id: { type: "string" },
            type: { type: "string", enum: ["Degree", "Certificate"] },
            title: { type: "string" },
            issue_date: { type: "string", format: "date-time" },
            expire_date: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["Pending", "Approved", "Rejected"] },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updateAt: { type: "string", format: "date-time" },
          },
        },
        Wallet: {
          type: "object",
          properties: {
            wallet_id: { type: "string" },
            instructor_id: { type: "string" },
            balance: { type: "number" },
            createAt: { type: "string", format: "date-time" },
            updateAt: { type: "string", format: "date-time" },
          },
        },
        InstructorCourseTransaction: {
          type: "object",
          properties: {
            instructor_course_transaction_id: { type: "string" },
            course_id: { type: "string" },
            wallet_id: { type: "string" },
            amount: { type: "number" },
            commision_rate: { type: "number" },
            status: { type: "string", enum: ["Pending", "Approved", "Rejected"] },
            createAt: { type: "string", format: "date-time" },
            updateAt: { type: "string", format: "date-time" },
          },
        },
        Categories: {
          type: "object",
          properties: {
            category_id: { type: "string" },
            category_name: { type: "string" },
            slug: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Level: {
          type: "object",
          properties: {
            level_id: { type: "string" },
            level_name: { type: "string" },
            course_id: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LearnerCourses: {
          type: "object",
          properties: {
            learner_course_id: { type: "string" },
            learner_id: { type: "string" },
            course_id: { type: "string" },
            status: { type: "string", enum: ["Enrolled", "Completed", "Cancelled"] },
            progress: { type: "number" },
            rating: { type: "integer" },
            feedback: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Chapter: {
          type: "object",
          properties: {
            chapter_id: { type: "string" },
            course_id: { type: "string" },
            chapter_title: { type: "string" },
            createAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Lesson: {
          type: "object",
          properties: {
            lesson_id: { type: "string" },
            chapter_id: { type: "string" },
            isCompleted: { type: "boolean" },
            duration: { type: "string" },
            createAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Note: {
          type: "object",
          properties: {
            note_id: { type: "string" },
            lesson_id: { type: "string" },
            user_id: { type: "string" },
            time: { type: "integer" },
            content: { type: "string" },
            createAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Feedback: {
          type: "object",
          properties: {
            id: { type: "string" },
            course_id: { type: "string" },
            user_id: { type: "string" },
            rating: { type: "integer" },
            comment: { type: "string" },
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
      ? path.resolve(__dirname, "../routes/*.ts")
      : path.resolve(__dirname, "../routes/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Ghi swaggerSpec ra file storage/swagger.json để import vào Postman 
const storageDir = path.resolve(__dirname, "../../storage");
const swaggerJsonPath = path.resolve(storageDir, "swagger.json");
try {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  const content = JSON.stringify(swaggerSpec, null, 2);
  fs.writeFileSync(swaggerJsonPath, content, { flag: "w" });
} catch (err) {
  console.error("Failed to write swagger.json:", err);
}

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
module.exports = { setupSwagger };