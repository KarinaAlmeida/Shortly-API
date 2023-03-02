import express from "express";
import {validateAuth, validateUrl} from "../middlewares/validateAuth.js";
import {shorten, getUrlId, open, deleteUrl} from "../controllers/url.controllers.js";
import {urlSchema}  from "../schemas/urlSchema.js";

const urlRoute = express.Router();

urlRoute.post('/urls/shorten', validateAuth(), validateUrl (urlSchema), shorten ); 
urlRoute.get('/urls/:id', getUrlId); 
urlRoute.get('/urls/open/:shortUrl', open); 
urlRoute.delete('/urls/:id', validateAuth(), deleteUrl); 


export default urlRoute;