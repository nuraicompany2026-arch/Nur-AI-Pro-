
const state = {
  maintenance: false,
  announcement: "",
  siteName: "NUR AI PRO"
};

function run(command) {
  const c = String(command || "").trim();

  if (c === "status") {
    return {
      success: true,
      message: "Жүйе жұмыс істеп тұр.",
      state: { ...state }
    };
  }

  if (c === "help") {
    return {
      success: true,
      message:
        "Командалар: status, help, maintenance-on, maintenance-off, title АТАУ, announce МӘТІН"
    };
  }

  if (c === "maintenance-on") {
    state.maintenance = true;

    return {
      success: true,
      message: "Техникалық режим қосылды."
    };
  }

  if (c === "maintenance-off") {
    state.maintenance = false;

    return {
      success: true,
      message: "Техникалық режим өшірілді."
    };
  }

  if (c.startsWith("title ")) {
    state.siteName = c.slice(6, 80);

    return {
      success: true,
      message: "Сайт атауы: " + state.siteName
    };
  }

  if (c.startsWith("announce ")) {
    state.announcement = c.slice(9, 250);

    return {
      success: true,
      message: "Хабарландыру сақталды."
    };
  }

  return {
    success: false,
    message: "Белгісіз команда. help деп жазыңыз."
  };
}

module.exports = {
  run,
  state
};
