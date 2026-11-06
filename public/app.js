const messages = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("message");
const statusEl = document.getElementById("status");
const sendButton = form.querySelector("button");

const userId = localStorage.getItem("nur_user_id") || "nursultan";
localStorage.setItem("nur_user_id", userId);

async function loadSettings() {
  try {
    const response = await fetch("/status");
    const data = await response.json();

    if (!response.ok || !data.success) return;

    document.title = data.name;
    document.querySelector("header h1").textContent = "✦ " + data.name;

    if (data.announcement) {
      addMessage("📢 " + data.announcement, "bot");
    }

    if (data.maintenance) {
      statusEl.textContent = "Техникалық қызмет көрсету режимі";
      input.disabled = true;
      sendButton.disabled = true;
    } else {
      statusEl.textContent = "Сервермен байланыс бар";
    }
  } catch {
    statusEl.textContent = "Сервермен байланыс жоқ";
  }
}

function addMessage(text, who) {
  const el = document.createElement("div");
  el.className = `msg ${who}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

addMessage("Сәлем! Мен NUR AI PRO. Қалай көмектесейін?", "bot");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message || input.disabled) return;

  addMessage(message, "user");
  input.value = "";
  sendButton.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Сервер қатесі");

    addMessage(data.reply, "bot");
  } catch (error) {
    addMessage("Қате: " + error.message, "bot");
  } finally {
    sendButton.disabled = false;
  }
});

loadSettings();
