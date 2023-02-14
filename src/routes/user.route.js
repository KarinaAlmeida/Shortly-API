import express from "express";
// import {getGames, postGames} from "../controllers/games.controllers.js";
// import validateGame from "../middlewares/validateGame.js";
// import { cadastraGame } from "../schemas/gameSchema.js";
// import existeGame from "../middlewares/existeValidate.js";

const userRoute = express.Router();

userRoute.post('/signup'); //post
userRoute.post('/signin'); //post
userRoute.get('/users/me'); //get



export default userRoute;