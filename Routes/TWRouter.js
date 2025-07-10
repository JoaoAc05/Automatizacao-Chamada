import express from "express";
import { twController } from "../src/Controller/TWController.js";

const TWRouter = express.Router();
const TWController = new twController();

TWRouter.get('/tempo', TWController.tempo);


export { TWRouter };