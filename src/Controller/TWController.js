import { prisma } from "../prisma.js";
import { json } from "express";

class twController {
    
    async tempo(req, res) {
        try {
            const response = await fetch("https://worldtimeapi.org/api/timezone/America/Cuiaba");
            const data = await response.json();
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).json({ datetime: data.datetime });
        } catch (error) {
            res.status(500).json({ error: "Erro ao obter o horário." });
        }
    }
    
}
export { twController };