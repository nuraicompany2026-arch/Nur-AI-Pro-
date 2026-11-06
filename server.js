
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
app.get("/api/status", (req, res) => {
  res.json({
    server: "online",
    gemini: process.env.GEMINI_API_KEY
      ? "configured"
      : "missing"
  });
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  
app.get("/admin/admin.js", (req, res) => {
  res.sendFile(
    path.join(__dirname, "admin", "admin.js")
  );
});
res.sendFile(path.join(__dirname, "admin.html"));
});

const fs = require("fs");
const path = require("path");

const settingsFile = path.join(__dirname, "../database/settings.json");

const defaultSettings = {
  maintenance: false,
  announcement: "",
  siteName: "NUR AI PRO"
};

function readSettings() {
  try {
    if (!fs.existsSync(settingsFile)) {
      fs.writeFileSync(
        settingsFile,
        JSON.stringify(defaultSettings, null, 2)
      );
    }

    return {
      ...defaultSettings,
      ...JSON.parse(fs.readFileSync(settingsFile, "utf8"))
    };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(settings) {
  fs.writeFileSync(
    settingsFile,
    JSON.stringify(settings, null, 2),
    "utf8"
  );
}

function run(command) {
  const c = String(command || "").trim();
  const settings = readSettings();

  if (c === "status") {
    return {
      success: true,
      message: "NUR AI PRO жүйесі жұмыс істеп тұр.",
      state: settings
    };
  }

  if (c === "help") {
    return {
      success: true,
      message:
        "Командалар: status, help, maintenance-on, maintenance-off, title АТАУ, announce МӘТІН"
    };
  }

  if (c === "maintenance-on") {
    settings.maintenance = true;
    saveSettings(settings);

    return {
      success: true,
      message: "Техникалық режим қосылды."
    };
  }

  if (c === "maintenance-off") {
    settings.maintenance = false;
    saveSettings(settings);

    return {
      success: true,
      message: "Техникалық режим өшірілді."
    };
  }

  if (c.startsWith("title ")) {
    settings.siteName = c.slice(6).trim().slice(0, 80);

    saveSettings(settings);

    return {
      success: true,
      message: "Жаңа атау: " + settings.siteName
    };
  }

  if (c.startsWith("announce ")) {
    settings.announcement = c.slice(9).trim().slice(0, 250);

    saveSettings(settings);

    return {
      success: true,
      message: "Хабарландыру сақталды."
    };
  }

  return {
    success: false,
    message: "Белгісіз команда. help деп жазыңыз."
  };
}

module.exports = { run, readSettings };
  res.json({
    success: true,
    name: "NUR AI PRO",
    status: "connected",
    version: "2.0.0",
    api: "not_required"
  });
});

app.post("/api/chat", async (req, res) => {
  try {const settings = commands.readSettings();

if (settings.maintenance) {
  return res.status(503).json({
    success: false,
    message: "NUR AI PRO уақытша техникалық қызмет көрсетуде."
  });
}
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

app.listen(PORT, "0.0.0.0", () => {app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Хабарлама бос болмауы керек"
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message
    });

    res.json({
      success: true,
      reply: response.text
    });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      success: false,
      error: "AI серверінде қате пайда болды"
    });
  }
});
  console.log(
    `NUR AI PRO іске қосылды: ${PORT}`
  );
});

