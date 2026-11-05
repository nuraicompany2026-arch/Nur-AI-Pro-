const knowledge = require("./knowledge");

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

function think(message, history = []) {
  const text = normalize(message);

  if (!text) {
    return "Сұрағыңды жазшы.";
  }

  const rules = [
    {
      keys: ["сәлем", "салем", "hello", "привет"],
      answer: "Сәлем! Мен NUR AI PRO. Саған қалай көмектесемін?"
    },
    {
      keys: ["атың кім", "сен кімсің"],
      answer: "Мен NUR AI PRO — дербес көмекші жүйесімін."
    },
    {
      keys: ["қалайсың", "кал қалай"],
      answer: "Жақсымын! Жүйе жұмысқа дайын."
    },
    {
      keys: ["рахмет", "рақмет"],
      answer: "Әрқашан көмектесуге дайынмын!"
    },
    {
      keys: ["уақытың", "сағат"],
      answer: "Нақты уақытты сервер арқылы алуға болады."
    }
  ];

  for (const rule of rules) {
    if (rule.keys.some(key => text.includes(key))) {
      return rule.answer;
    }
  }

  const result = knowledge.search(message);

  if (result) {
    return result;
  }

  if (history.length > 0) {
    return "Сұрағыңды түсіндім. Бірақ бұл тақырып бойынша білім базамда әзірге ақпарат жоқ. Толығырақ түсіндіріп бере аласың ба?";
  }

  return "Бұл сұраққа әзірге нақты жауабым жоқ. Білім базама жаңа ақпарат қосу керек.";
}

module.exports = { think };
