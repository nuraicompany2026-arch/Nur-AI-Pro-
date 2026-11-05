
export default function handler(req, res) {
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
    name: "NUR AI PRO",
    admin: "NUR AI ADMIN",
    version: "1.0.0",
    core: "active",
    maintenance: false
  });
}
