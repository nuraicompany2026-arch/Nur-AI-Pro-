function analyze(message) {
  const text = String(message || "").trim();

  return {
    original: text,
    length: text.length,
    words: text.split(/\s+/).filter(Boolean).length,
    question: text.includes("?") ||
      text.includes("ма") ||
      text.includes("ме"),
    language: /[әіңғүұқөһ]/i.test(text)
      ? "kk"
      : "unknown",
    valid: text.length > 0
  };
}

function compare(a, b) {
  return {
    firstLength: String(a).length,
    secondLength: String(b).length,
    equal: String(a) === String(b)
  };
}

module.exports = { analyze, compare };
