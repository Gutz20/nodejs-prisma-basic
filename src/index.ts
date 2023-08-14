import "dotenv/config"
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/all.routes";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "*", // Replace for process.env.FRONTEND_URL
    methods: ["POST", "PUT", "DELETE", "GET", "OPTIONS"],
    credentials: true,
  })
);
app.disable("x-powered-by"); // less hackers know about our stack

// API ROUTES
app.use("/api", routes);
app.use("/health-check", (_, res) => {
  res.status(200).send(process.env.FRONTEND_URL);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
