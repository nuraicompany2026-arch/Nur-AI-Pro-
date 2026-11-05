const NUR_AI = require("../core");

module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "GET сұранысы қажет"
    });
  }

  return res.status(200).json({
    success: true,
    status: "connected",
    name: NUR_AI.name,
    admin: "NUR AI ADMIN",
    version: NUR_AI.version,
    core: "active",
    maintenance: NUR_AI.maintenance
  });
};
