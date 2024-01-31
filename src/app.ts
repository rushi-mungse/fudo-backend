import "reflect-metadata";
import express from "express";
import { errorHandlerMiddleware } from "./middlewares";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import {
    authRouter,
    categoryRouter,
    productRouter,
    shippingRouter,
    userRouter,
    orderRouter,
    sizeRouter,
} from "./routes";
import path from "path";

const app = express();

const corsOption: cors.CorsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "src/uploads")));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/size", sizeRouter);

app.use(errorHandlerMiddleware);

export default app;
