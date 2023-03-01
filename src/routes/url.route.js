import express from "express";
import {validateAuth, validateUrl} from "../middlewares/validateAuth.js";
import {shorten, getUrlId} from "../controllers/url.controllers.js";
import {urlSchema}  from "../schemas/urlSchema.js";

const urlRoute = express.Router();

urlRoute.post('/urls/shorten', validateAuth(), validateUrl (urlSchema), shorten ); 
urlRoute.get('/urls/:id', getUrlId); 
urlRoute.get('/urls/open/:shortUrl'); 
urlRoute.delete('/urls/:id'); 


export default urlRoute;