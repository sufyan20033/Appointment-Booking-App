import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import clinicRoutes from "./routes/clinicRoute.js";
import appointmentRoutes from "./routes/appointmentRoute.js"
import authRoutes from "./routes/authRoute.js";




dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/appointments", appointmentRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));