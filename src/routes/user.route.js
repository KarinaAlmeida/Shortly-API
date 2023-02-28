import express from "express";
import {signUp} from "../controllers/users.controllers.js";
import {login} from "../controllers/users.controllers.js";
import validateUser from "../middlewares/validateUser.js";
import {userSchema}  from "../schemas/usersSchema.js";
import validateLogin from "../middlewares/validateLogin.js";
import {loginSchema}  from "../schemas/usersSchema.js";
// import existeGame from "../middlewares/existeValidate.js";

const userRoute = express.Router();

userRoute.post('/signup', validateUser(userSchema), signUp); 
userRoute.post('/signin', validateLogin (loginSchema), login); 
userRoute.get('/users/me'); //get



export default userRoute;