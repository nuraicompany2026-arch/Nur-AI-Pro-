
const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "../database");
const file = path.join(folder, "memory.json");

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "{}", "utf8");
}

function readAll() {
  try {
    return JSON.parse(
      fs.readFileSync(file, "utf8") || "{}"
    );
  } catch (error) {
    console.error("MEMORY READ ERROR:", error);
    return {};
  }
}

function writeAll(data) {
  const temp = file + ".tmp";

  fs.writeFileSync(
    temp,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  fs.renameSync(temp, file);
}

function save(userId, item) {
  const data = readAll();

  if (!Array.isArray(data[userId])) {
    data[userId] = [];
  }

  data[userId].push({
    role: item.role || "note",
    text: String(item.text || "").slice(0, 1000),
    at: new Date().toISOString()
  });

  data[userId] = data[userId].slice(-100);

  writeAll(data);

  return true;
}

function recall(userId) {
  const data = readAll();
  return data[userId] || [];
}

function clear(userId) {
  const data = readAll();

  delete data[userId];

  writeAll(data);
}

module.exports = {
  save,
  recall,
  clear
};

