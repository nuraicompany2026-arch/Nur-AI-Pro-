
function classify(text) {
  const t = String(text || "").toLowerCase();

  if (/[0-9]+\s*[+\-*/]\s*[0-9]+/.test(t)) {
    return "calculation";
  }

  if (/сәлем|салем|hello|привет/.test(t)) {
    return "greeting";
  }

  if (/көмек|help/.test(t)) {
    return "help";
  }

  if (/жоспар|жоспарлау/.test(t)) {
    return "planning";
  }

  return "general";
}

module.exports = { classify };

