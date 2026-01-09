import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { setupSwagger } from "./docs/swagger";
import { createDefaultUserIfNoneExists } from "./services/user.service";
import { seedResourceTypes } from "./services/resourceType.service";
import { initializeSocket } from "./socket";
import { startCronJobs } from "./jobs/cronJobs";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";
import feedbackRoutes from "./routes/feedback.routes";
import learnerRoutes from "./routes/learner.routes";
import instructorRoutes from "./routes/instructor.routes";
import adminRoutes from "./routes/admin.routes";
import adminRoleRoutes from "./routes/adminRole.routes";
import permissionRoutes from "./routes/permission.routes";
import adminRolePermissionRoutes from "./routes/adminRolePermission.routes";
import accountSecurityRoutes from "./routes/accountSecurity.routes";
import instructorSpecializationsRoutes from "./routes/instructorSpecializations.routes";
import specializationRoutes from "./routes/specialization.routes";
import citizenIdsConfirmRoutes from "./routes/citizenIdsConfirm.routes";
import instructorQualificationsRoutes from "./routes/instructorQualifications.routes";
import walletRoutes from "./routes/wallet.routes";
import bankAccountRoutes from "./routes/bankAccount.routes";
import categoriesRoutes from "./routes/categories.routes";
import levelRoutes from "./routes/level.routes";
import learnerCoursesRoutes from "./routes/learnerCourses.routes";
import chapterRoutes from "./routes/chapter.routes";
import lessonRoutes from "./routes/lesson.routes";
import noteRoutes from "./routes/note.routes";
import quizRoutes from "./routes/quiz.routes";
import questionRoutes from "./routes/question.routes";
import optionsRoutes from "./routes/options.routes";
import answerRoutes from "./routes/answer.routes";
import submissionRoutes from "./routes/submission.routes";
import paymentRoutes from "./routes/payment.routes";
import withdrawRoutes from "./routes/withdraw.routes";
import resourceTypeRoutes from "./routes/resourceType.routes";
import permissionOnResourceRoutes from "./routes/permissionOnResource.routes";
import groupRoutes from "./routes/group.routes";
import courseGroupRoutes from "./routes/courseGroup.routes";
import favoriteRoutes from "./routes/favorite.routes";
import instructorStatsRoutes from "./routes/instructorStats.routes";
import lessonProgressRoutes from "./routes/lessonProgress.routes";
import chapterProgressRoutes from "./routes/chapterProgress.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";
import passport from "passport";
import "./lib/passport";
import cookieParser from "cookie-parser";
import { seedCategories } from "./services/categories.service";
import { seedLevels } from "./services/level.service";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ["http://localhost:3000", "http://localhost:3001", "http://learnary.site"];

//middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (webhooks, Postman)
      if (!origin) return callback(null, true);

      // Cho phép các origin trong whitelist
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Cho phép tất cả PayOS domains
      if (origin.includes('payos.vn')) return callback(null, true);

      // Block các domain khác
      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "BearerToken"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", conversationRoutes);
app.use("/api", messageRoutes);
app.use("/api", paymentRoutes);
app.use("/api", withdrawRoutes);
app.use("/api", userRoutes);
app.use("/api", courseGroupRoutes);
app.use("/api", groupRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", levelRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", courseRoutes);//public  thì để trc course
app.use("/api", learnerRoutes);
app.use("/api", instructorRoutes);
app.use("/api/instructor", instructorStatsRoutes);
app.use("/api", adminRoutes);
app.use("/api", adminRoleRoutes);
app.use("/api", permissionRoutes);
app.use("/api", adminRolePermissionRoutes);
app.use("/api", resourceTypeRoutes);
app.use("/api", permissionOnResourceRoutes);
app.use("/api", favoriteRoutes);
app.use("/api", accountSecurityRoutes);
app.use("/api", instructorSpecializationsRoutes);
app.use("/api", specializationRoutes);
app.use("/api", citizenIdsConfirmRoutes);
app.use("/api", instructorQualificationsRoutes);
app.use("/api", walletRoutes);
app.use("/api", bankAccountRoutes);
app.use("/api", learnerCoursesRoutes);
app.use("/api", chapterRoutes);
app.use("/api", lessonRoutes);
app.use("/api", lessonProgressRoutes);
app.use("/api", chapterProgressRoutes);
app.use("/api", noteRoutes);
app.use("/api", quizRoutes);
app.use("/api", questionRoutes);
app.use("/api", optionsRoutes);
app.use("/api", answerRoutes);
app.use("/api", submissionRoutes);
app.use("/api", conversationRoutes);
app.use("/api", messageRoutes);

app.get("/", (_, res) => {
  const environment = process.env.NODE_ENV || 'development';
  const isDevelopment = environment === 'development';

  res.json({
    status: "running",
    message: "Backend đang chạy rất bình tĩnh và bình thường 🚀",
    environment: environment,
    mode: isDevelopment ? "LOCAL" : "PRODUCTION",
    timestamp: new Date().toISOString(),
    database: {
      host: isDevelopment ? "localhost:5433" : "Heroku Postgres",
      type: isDevelopment ? "Local PostgreSQL" : "Production PostgreSQL"
    },
    server: {
      port: process.env.PORT || 4000,
      uptime: `${Math.floor(process.uptime())}s`
    },
    links: {
      swagger: "/api-docs",
      health: "/api/health",
      healthDb: "/api/health/db"
    }
  });
});
async function repareResourceSystem() {
  await seedResourceTypes();
  await createDefaultUserIfNoneExists();
  await seedCategories();
  await seedLevels();
}
async function startServer() {
  try {
    console.log(`\n🚀 Starting server...`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Database: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    console.log("✅ Database connection successful");

    repareResourceSystem();

    setupSwagger(app);

    initializeSocket(server);
    console.log("✅ Socket.io initialized");

    startCronJobs();

    server.listen(port, () => {
      console.log(`\n✅ Server is running on http://localhost:${port}`);
      console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`);
      console.log(`🔌 Socket.io ready for connections`);
      console.log(`🎉 Backend Service is fully ready!\n`);
    });
  } catch (err) {
    console.error("❌ Fatal Error: Could not start server", err);
    process.exit(1);
  }
}

startServer();
export default app;
