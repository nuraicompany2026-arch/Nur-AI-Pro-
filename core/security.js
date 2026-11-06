
function safeText(value, max = 1000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

function validUserId(value) {
  if (
    typeof value !== "string" ||
    !/^[a-zA-Z0-9_-]{1,40}$/.test(value)
  ) {
    return null;
  }

  return value;
}

function adminKeyOk(value) {
  const expected = process.env.NUR_ADMIN_KEY;

  return Boolean(
    expected &&
    typeof value === "string" &&
    value === expected
  );
}

module.exports = {
  safeText,
  validUserId,
  adminKeyOk
};
