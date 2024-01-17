import "reflect-metadata";
import express from "express";
import { errorHandlerMiddleware } from "./middlewares";
import { authRouter, shippingRouter, userRouter } from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shipping", shippingRouter);

app.use(errorHandlerMiddleware);

export default app;
