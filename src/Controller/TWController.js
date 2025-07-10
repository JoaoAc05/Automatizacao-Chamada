import axios from "axios";

class twController {
    async tempo(req, res) {
        try {
            const response = await axios.get("https://timeapi.io/api/Time/current/zone?timeZone=America/Cuiaba");
            const data = response.data;

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).json({ datetime: data.dateTime }); // usa dateTime da nova API
        } catch (error) {
            console.error("Erro ao obter horário:", error.message);
            res.status(500).json({ error: "Erro ao obter o horário." });
        }
    }
}

export { twController };
