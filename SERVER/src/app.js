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
import userRouter from './routers/user.routes.js';
import courseRouter from './routers/course.routes.js';
import eventRouter from './routers/event.routes.js';
import productRouter from './routers/product.routes.js';
import orderRouter from './routers/order.routes.js';
import submissionRouter from './routers/submission.routes.js';

// routes declare
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/events", eventRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/submissions", submissionRouter);

export { app };