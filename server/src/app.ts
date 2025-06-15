import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

const app = express();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN!],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());
app.use(pinoHttp());

// Routes
import userRouter from "./routes/user.routes";
import chatRouter from "./routes/chat.routes";

app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

export default app;
