const NUR_AI = require("../core");
const memory = require("../memory");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST сұранысы қажет"
    });
  }

  try {
    const { message, userId = "nursultan" } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Хабарлама бос болмауы керек"
      });
    }

    if (NUR_AI.maintenance) {
      return res.status(503).json({
        success: false,
        error: "Жүйе техникалық қызмет көрсетуде."
      });
    }

    const history = memory.recall(userId);

    memory.remember(userId, message);

    const answer = NUR_AI.think(message);

    memory.remember(userId, `NUR AI: ${answer}`);

    return res.status(200).json({
      success: true,
      name: NUR_AI.name,
      answer,
      memory: {
        saved: true,
        count: history.length + 2
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "NUR AI сервер қатесі"
    });
  }
};
