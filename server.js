const memory = require("./memory");
const express = require("express");
const NUR_AI = require("./core");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.post("/memory/save", (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({
      success: false,
      message: "userId және message қажет"
    });
  }

  memory.remember(userId, message);

  res.json({
    success: true,
    message: "Есте сақталды!"
  });
});

app.get("/memory/:userId", (req, res) => {
  const messages = memory.recall(req.params.userId);

  res.json({
    success: true,
    messages
  });
});

app.delete("/memory/:userId", (req, res) => {
  memory.clearMemory(req.params.userId);

  res.json({
    success: true,
    message: "Жад тазартылды"
  });
});
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
