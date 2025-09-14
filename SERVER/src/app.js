import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import submissionRouter from './routes/submissionRoutes.js';

// routes declare
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/events", eventRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/submissions", submissionRouter);

export { app };