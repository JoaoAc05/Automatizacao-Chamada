import axios from "axios";

class twController {
    async tempo(req, res) {
        try {
            const response = await axios.get("https://worldtimeapi.org/api/timezone/America/Cuiaba");
            const data = response.data;

            res.setHeader("Access-Control-Allow-Origin", "*"); // para permitir uso via navegador
            res.status(200).json({ datetime: data.datetime });
        } catch (error) {
            console.error("Erro ao obter horário:", error.message); // importante para depuração
            res.status(500).json({ error: "Erro ao obter o horário." });
        }
    }
}

export { twController };
