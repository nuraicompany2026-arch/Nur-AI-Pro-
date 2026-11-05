
const NUR_AI = require("../../core");

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST сұранысы қажет"
    });
  }

  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers["x-admin-secret"];

  if (!secret || provided !== secret) {
    return res.status(401).json({
      success: false,
      error: "ADMIN рұқсаты берілмеді"
    });
  }

  const { command } = req.body || {};

  if (typeof command !== "string" || command.length > 50) {
    return res.status(400).json({
      success: false,
      error: "Команда дұрыс емес"
    });
  }

  const result = NUR_AI.execute(command.trim());

  return res.status(result.success ? 200 : 400).json(result);
};
