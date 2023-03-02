import express from "express";

const rankingRoute = express.Router();

rankingRoute.get('/ranking');

export default rankingRoute;