import express, { Express, Request, Response } from "express";
import cors from 'cors';
import dotenv from "dotenv";
import routes from "./routes/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors<Request>());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/v1",routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;