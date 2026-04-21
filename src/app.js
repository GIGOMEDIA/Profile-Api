import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", profileRoutes);

export default app;