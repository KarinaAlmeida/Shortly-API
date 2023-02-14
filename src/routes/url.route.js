import express from "express";

const urlRoute = express.Router();

urlRoute.post('/urls/shorten'); 
urlRoute.get('/urls/:id'); 
urlRoute.get('/urls/open/:shortUrl'); 
urlRoute.delete('/urls/:id'); 


export default urlRoute;