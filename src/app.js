import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import joi from "joi";
// import {db} from "./database/database.connection.js";
import userRoute from "./routes/user.route.js";
import urlRoute from "./routes/url.route.js";


dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));


server.use(userRoute)
server.use(urlRoute)


