import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import accountsRouter from "./routes/accounts.js";
import campaignsRouter from "./routes/campaigns.js";
import tasksRouter from "./routes/tasks.js";
import logsRouter from "./routes/logs.js";
import proxiesRouter from "./routes/proxies.js";

dotenv.config();
const app = express();
app.use(cors({ origin: "*" })); // restrict to your frontend domain in production
app.use(express.json());

app.use("/api/accounts", accountsRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/logs", logsRouter);
app.use("/api/proxies", proxiesRouter);

app.get("/", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT;
if (!PORT) {
  console.error("FATAL: process.env.PORT is not set. Render provides it automatically.");
  process.exit(1);
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
