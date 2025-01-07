import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import prisma from "./DB/db.config.js";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Resolve the current directory for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "client", "dist")));

// Catch-all route to serve React app
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
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

// Connect to the database and start the server
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
