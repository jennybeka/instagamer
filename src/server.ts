import * as dotenv from "dotenv";
import { App } from "./app";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;

App.run(PORT);
