import express from "express";
import {login, signUp, userMe, rank} from "../controllers/users.controllers.js";
import validateUser from "../middlewares/validateUser.js";
import {userSchema}  from "../schemas/usersSchema.js";
import validateLogin from "../middlewares/validateLogin.js";
import {loginSchema}  from "../schemas/usersSchema.js";
import {validateAuth} from "../middlewares/validateAuth.js";

const userRoute = express.Router();

userRoute.post('/signup', validateUser(userSchema), signUp); 
userRoute.post('/signin', validateLogin (loginSchema), login); 
userRoute.get('/users/me', validateAuth(), userMe);
userRoute.get('/ranking', rank);



export default userRoute;