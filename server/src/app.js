import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "EventSphere API Running"
    });
});

export default app;