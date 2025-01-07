import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import prisma from "./DB/db.config.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true, 
    })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api-v1", routes);

// 404 Route Handler
app.use("*", (req, res) => {
    res.status(404).json({
        status: "404 Not Found",
        message: "Route not found",
    });
});

// Error Handling Middleware (must come last)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

prisma.$connect()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed: ", err);
    });
