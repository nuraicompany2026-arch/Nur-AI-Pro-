
function answerSystem(text) {
  const t = String(text || "").toLowerCase();

  if (/уақыт|сағат қанша/.test(t)) {
    return "Құрылғы уақыты: " +
      new Date().toLocaleString("kk-KZ");
  }

  if (/нұсқа|версия|version/.test(t)) {
    return "NUR AI PRO 2.0";
  }

  if (/жүйе күйі|system status/.test(t)) {
    return "NUR AI PRO жүйесінің жауап беру модульдері іске қосылған.";
  }

  return null;
}

module.exports = { answerSystem };

