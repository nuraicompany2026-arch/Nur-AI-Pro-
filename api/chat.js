module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST сұранысы қажет"
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Хабарлама бос болмауы керек"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "AI API кілті серверде бапталмаған"
      });
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-12).filter(item =>
          ["user", "model"].includes(item.role) &&
          Array.isArray(item.parts) &&
          typeof item.parts[0]?.text === "string"
        )
      : [];

    const contents = [
      ...safeHistory,
      {
        role: "user",
        parts: [{ text: message.slice(0, 10000) }]
      }
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "Сен NUR AI PRO атты ақылды көмекшісің. Қазақ тілінде анық, пайдалы және шынайы жауап бер."
            }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "AI провайдерінен жауап келмеді",
        details: data.error?.message || "API қатесі"
      });
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!answer) {
      return res.status(502).json({
        error: "AI бос жауап қайтарды"
      });
    }

    return res.status(200).json({
      success: true,
      name: "NUR AI PRO",
      answer
    });

  } catch (error) {
    return res.status(500).json({
      error: "Сервер қатесі"
    });
  }
};
