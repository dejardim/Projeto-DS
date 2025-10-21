import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Mensagem recebida:", message);

  // Simule uma resposta
  const reply = `Você disse: "${message}". Esta é uma resposta simulada.`;

  res.json({ reply });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
