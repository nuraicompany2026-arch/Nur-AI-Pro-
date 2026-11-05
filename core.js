const NUR_AI = {
  name: "NUR AI PRO",
  version: "1.0.0",
  maintenance: false,

  commands: {},

  execute(command) {
    const action = this.commands[command];

    if (!action) {
      return {
        success: false,
        message: "Белгісіз команда: " + command
      };
    }

    return action(this);
  }
};

NUR_AI.commands = {
  status: (context) => ({
    success: true,
    message: context.name + " жүйесі жұмыс істеп тұр."
  }),

  "maintenance-on": (context) => {
    context.maintenance = true;

    return {
      success: true,
      message: "Техникалық қызмет көрсету режимі қосылды."
    };
  },

  "maintenance-off": (context) => {
    context.maintenance = false;

    return {
      success: true,
      message: "Техникалық қызмет көрсету режимі өшірілді."
    };
  },

  info: (context) => ({
    success: true,
    message:
      "Атауы: " + context.name +
      "\nНұсқасы: " + context.version +
      "\nMaintenance: " + context.maintenance
  })
};

module.exports = NUR_AI;
