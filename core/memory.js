const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../database/memory.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function remember(user, message, answer) {
  const data = load();

  data.push({
    id: Date.now().toString(),
    user,
    message,
    answer,
    date: new Date().toISOString()
  });

  save(data);
}

function getHistory(user, limit = 20) {
  return load()
    .filter(item => item.user === user)
    .slice(-limit);
}

function clear(user) {
  save(load().filter(item => item.user !== user));
}

module.exports = {
  load,
  save,
  remember,
  getHistory,
  clear
};
