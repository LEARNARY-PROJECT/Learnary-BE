import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./docs/swagger";
import { createDefaultUserIfNoneExists } from "./services/user.service";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";
import feedbackRoutes from "./routes/feedback.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", feedbackRoutes);
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
