
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const memory = require("./core/memory");
const commands = require("./core/commands");
const { handleChat } = require("./core/brain");
const {
  safeText,
  validUserId,
  adminKeyOk
} = require("./core/security");

app.disable("x-powered-by");

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/status", (req, res) => {
  res.json({
    success: true,
    name: "NUR AI PRO",
    status: "connected",
    version: "2.0.0",
    api: "not_required"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = safeText(
      req.body?.message,
      2000
    );

    const userId =
      validUserId(req.body?.userId) || "guest";

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Хабарлама бос."
      });
    }

    const history = memory.recall(userId);

    const result = await handleChat(message, {
      userId,
      history
    });

    memory.save(userId, {
      role: "user",
      text: message
    });

    memory.save(userId, {
      role: "assistant",
      text: result.reply
    });

    res.json({
      success: true,
      reply: result.reply,
      module: result.module
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Сервер қатесі."
    });
  }
});

app.post("/memory/save", (req, res) => {
  const userId = validUserId(req.body?.userId);
  const text = safeText(req.body?.text, 1000);

  if (!userId || !text) {
    return res.status(400).json({
      success: false,
      message: "Деректер дұрыс емес."
    });
  }

  memory.save(userId, {
    role: "note",
    text
  });

  res.json({
    success: true,
    message: "Жадқа сақталды."
  });
});

app.get("/memory/:userId", (req, res) => {
  const userId = validUserId(req.params.userId);

  if (!userId) {
    return res.status(400).json({
      success: false
    });
  }

  res.json({
    success: true,
    memory: memory.recall(userId)
  });
});

app.delete("/memory/:userId", (req, res) => {
  const userId = validUserId(req.params.userId);

  if (!userId) {
    return res.status(400).json({
      success: false
    });
  }

  memory.clear(userId);

  res.json({
    success: true,
    message: "Жад тазартылды."
  });
});

app.post("/admin/command", (req, res) => {
  const key = req.headers["x-admin-key"];

  if (!adminKeyOk(key)) {
    return res.status(403).json({
      success: false,
      message: "Әкімші кілті қате."
    });
  }

  const command = safeText(
    req.body?.command,
    300
  );

  res.json(commands.run(command));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `NUR AI PRO іске қосылды: ${PORT}`
  );
});

