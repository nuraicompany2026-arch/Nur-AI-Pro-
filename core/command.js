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
