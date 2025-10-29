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
import instructorCourseTransactionRoutes from "./routes/instructorCourseTransaction.routes";
import categoriesRoutes from "./routes/categories.routes";
import levelRoutes from "./routes/level.routes";
import learnerCoursesRoutes from "./routes/learnerCourses.routes";
import chapterRoutes from "./routes/chapter.routes";
import lessonRoutes from "./routes/lesson.routes";
import noteRoutes from "./routes/note.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization","BearerToken"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api", instructorCourseTransactionRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", levelRoutes);
app.use("/api", learnerCoursesRoutes);
app.use("/api", chapterRoutes);
app.use("/api", lessonRoutes);
app.use("/api", noteRoutes);

//test routes
app.get("/", (req, res) => {
  res.send("Backend đang chạy rất bình tĩnh và bình thường");
});

createDefaultUserIfNoneExists()
  .then(() => {
    console.log(
      "App initialized with default admin user if no user with ADMIN role existed"
    );
  })
  .catch((err) => {
    console.error("Error creating default user", err);
  });

//Swagger
setupSwagger(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
});

export default app;
