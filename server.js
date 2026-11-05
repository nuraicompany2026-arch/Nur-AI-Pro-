const express = require("express");
const NUR_AI = require("./core");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/status", (req, res) => {
  res.json({
    status: "connected",
    name: NUR_AI.name,
    version: NUR_AI.version,
    admin: "NUR AI ADMIN"
  });
});

app.post("/admin/command", (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== "string") {
    return res.status(400).json({
      success: false,
      message: "Команда енгізілмеді."
    });
  }

  const result = NUR_AI.execute(command.trim());

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`${NUR_AI.name} сервері іске қосылды: ${PORT}`);
});
