import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./docs/swagger";
import { createDefaultUserIfNoneExists } from "./services/user.service";
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
import passport from "passport";
import "./lib/passport";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',') // sử dụng chuỗi phân tách bằng dấu phẩy
  : ["http://localhost:3000", "http://localhost:3001", "http://learnary.site"];
//middlewares
app.use(
  cors({
    origin: allowedOrigins,
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
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", learnerRoutes);
app.use("/api", instructorRoutes);
app.use("/api", adminRoutes);
app.use("/api", adminRoleRoutes);
app.use("/api", permissionRoutes);
app.use("/api", adminRolePermissionRoutes);
app.use("/api", accountSecurityRoutes);
app.use("/api", instructorSpecializationsRoutes);
app.use("/api", specializationRoutes);
app.use("/api", citizenIdsConfirmRoutes);
app.use("/api", instructorQualificationsRoutes);
app.use("/api", walletRoutes);
app.use("/api", bankAccountRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", levelRoutes);
app.use("/api", learnerCoursesRoutes);
app.use("/api", chapterRoutes);
app.use("/api", lessonRoutes);
app.use("/api", noteRoutes);
app.use("/api", quizRoutes);
app.use("/api", questionRoutes);
app.use("/api", optionsRoutes);
app.use("/api", answerRoutes);
app.use("/api", submissionRoutes);

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

async function startServer() {
  try {
    console.log(`\n🚀 Starting server...`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Database: ${isDevelopment ? 'LOCAL' : 'PRODUCTION'}`);
    
    await createDefaultUserIfNoneExists();
    console.log("✅ Database connection successful");

    setupSwagger(app);

    app.listen(port, () => {
      console.log(`\n✅ Server is running on http://localhost:${port}`);
      console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`);
      console.log(`🎉 Backend Service is fully ready!\n`);
    });
  } catch (err) {
    console.error("❌ Fatal Error: Could not start server", err);
    process.exit(1);
  }
}
createDefaultUserIfNoneExists()
  .then(() => {
    console.log(
      "Backend Service is ready!"
    );
  })
  .catch((err) => {
    console.error("Error creating default user", err);
  });
startServer();
export default app;
