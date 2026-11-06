
function calculate(input) {
  const match = String(input || "")
    .replace(",", ".")
    .match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);

  if (!match) return null;

  const a = Number(match[1]);
  const b = Number(match[3]);
  const op = match[2];

  if (op === "/" && b === 0) {
    return "Нөлге бөлуге болмайды.";
  }

  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    default:
      return null;
  }

  return "Жауабы: " + Number(result.toPrecision(12));
}

module.exports = { calculate };
