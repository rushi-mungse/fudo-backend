import "reflect-metadata";
import express from "express";
import { errorHandlerMiddleware } from "./middlewares";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {
    authRouter,
    categoryRouter,
    productRouter,
    shippingRouter,
    userRouter,
    orderRouter,
} from "./routes";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

app.use(errorHandlerMiddleware);

export default app;
