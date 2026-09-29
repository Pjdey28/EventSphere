import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { runNotificationSweep } from "./services/notification.service.js";

dotenv.config();

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    server.listen(5000, () => {
        console.log("Server running on port 5000");
        runNotificationSweep().catch((error) => console.error("Notification sweep failed", error));
        setInterval(() => runNotificationSweep().catch((error) => console.error("Notification sweep failed", error)), 60 * 1000);
    });
})
.catch((err) => console.log(err));