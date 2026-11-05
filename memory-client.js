const MemoryClient = {
  userId: "nursultan",

  async save(message) {
    try {
      const response = await fetch("/memory/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: this.userId,
          message
        })
      });

      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  async recall() {
    try {
      const response = await fetch(
        `/memory/${this.userId}`
      );

      return await response.json();
    } catch (error) {
      return { success: false, messages: [] };
    }
  },

  async clear() {
    const response = await fetch(
      `/memory/${this.userId}`,
      { method: "DELETE" }
    );

    return await response.json();
  }
};

window.MemoryClient = MemoryClient;
