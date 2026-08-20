import cors from "cors";
import express from "express";
import { packageRouter } from "./routes/packageRoutes.js";

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "travel-basket-api" }));
app.use("/api", packageRouter);
app.listen(port, () => console.log(`Travel Basket API listening on http://localhost:${port}`));
