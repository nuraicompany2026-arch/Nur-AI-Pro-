const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "memory.json");

function loadMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      return {};
    }

    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
  } catch (error) {
    return {};
  }
}

function saveMemory(data) {
  fs.writeFileSync(
    MEMORY_FILE,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

function remember(userId, message) {
  const memory = loadMemory();

  if (!memory[userId]) {
    memory[userId] = [];
  }

  memory[userId].push({
    message,
    date: new Date().toISOString()
  });

  memory[userId] = memory[userId].slice(-100);

  saveMemory(memory);

  return true;
}

function recall(userId) {
  const memory = loadMemory();
  return memory[userId] || [];
}

function clearMemory(userId) {
  const memory = loadMemory();
  delete memory[userId];
  saveMemory(memory);
  return true;
}

module.exports = {
  remember,
  recall,
  clearMemory
};
