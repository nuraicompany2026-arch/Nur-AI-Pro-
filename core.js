const NUR_AI = {
  name: "NUR AI PRO",
  version: "2.0.0",
  maintenance: false,

  memory: {},

  commands: {
    status(context) {
      return {
        success: true,
        message: `${context.name} жүйесі жұмыс істеп тұр.`
      };
    },

    "maintenance-on"(context) {
      context.maintenance = true;
      return {
        success: true,
        message: "Техникалық қызмет көрсету режимі қосылды."
      };
    },

    "maintenance-off"(context) {
      context.maintenance = false;
      return {
        success: true,
        message: "Техникалық қызмет көрсету режимі өшірілді."
      };
    },

    help() {
      return {
        success: true,
        message: "Командалар: status, maintenance-on, maintenance-off, help"
      };
    }
  },

  remember(userId, message) {
    if (!this.memory[userId]) {
      this.memory[userId] = [];
    }

    this.memory[userId].push({
      message,
      date: new Date().toISOString()
    });

    this.memory[userId] =
      this.memory[userId].slice(-100);

    return true;
  },

  recall(userId) {
    return this.memory[userId] || [];
  },

  think(message) {
    const text = message.toLowerCase().trim();

    if (text.includes("сәлем") || text.includes("салем")) {
      return "Сәлем! Мен NUR AI PRO көмекшісімін. Қалай көмектесейін?";
    }

    if (text.includes("атың")) {
      return "Менің атым NUR AI PRO!";
    }

    if (text.includes("қалайсың")) {
      return "Жақсымын! Сенімен жұмыс істеуге дайынмын.";
    }

    if (text.includes("уақытың")) {
      return `Қазіргі уақыт: ${new Date().toLocaleTimeString("kk-KZ")}`;
    }

    return "Сұрағыңды түсіндім. Мен NUR AI PRO ядросымын. Әзірге жергілікті білім базам шектеулі.";
  },

  execute(command) {
    const action = this.commands[command];

    if (!action) {
      return {
        success: false,
        message: "Белгісіз команда. help деп жазыңыз."
      };
    }

    return action(this);
  }
};

if (typeof module !== "undefined") {
  module.exports = NUR_AI;
}
