const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

//mongoose.connect("mongodb+srv://alejandrop2506:   @cluster0.trhco.mongodb.net/sensor_nivel?retryWrites=true&w=majority&appName=Cluster0", {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro na conexão com o MongoDB:"));
db.once("open", () => console.log("Conectado ao MongoDB!"));

app.use(cors());
app.use(bodyParser.json());

const DistanceSchema = new mongoose.Schema({
    distance: Number,
    timestamp: { type: Date, default: Date.now }
});

const Distance = mongoose.model("Distance", DistanceSchema);

app.post("/sensor", async (req, res) => {
    try {
        const { distance } = req.body;
        const newEntry = new Distance({ distance });
        await newEntry.save();
        res.status(200).json({ message: "Dados salvos!", distance });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar dados", error });
    }
});

app.get("/sensor", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Obtém o valor da URL, ou usa 10 como padrão
        const data = await Distance.find().sort({ timestamp: -1 }).limit(limit);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados", error });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});