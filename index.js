import dotenv from "dotenv";
import path from "path";
dotenv.config({path:path.resolve("config/.env")})
import express from "express";
import { initApp } from "./src/init.app.js";

const app = express();

initApp(app , express)


app.listen(process.env.PORT||3001)
