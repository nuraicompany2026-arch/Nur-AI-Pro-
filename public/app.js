
const messages = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("message");
const statusEl = document.getElementById("status");
const sendButton = form.querySelector("button");

const userId =
  localStorage.getItem("nur_user_id") || "nursultan";

localStorage.setItem("nur_user_id", userId);

function addMessage(text, who) {
  const el = document.createElement("div");

  el.className = `msg ${who}`;
  el.textContent = text;

  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

addMessage(
  "Сәлем! Мен NUR AI PRO. Сұрағыңды жаза бер.",
  "bot"
);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";
  sendButton.disabled = true;
  statusEl.textContent = "Жауап дайындалып жатыр...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        userId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Сервер қатесі");
    }

    addMessage(
      data.reply || "Жауап алынбады.",
      "bot"
    );

    statusEl.textContent = "Байланыс бар";

  } catch (error) {
    addMessage(
      "Қате: " + error.message,
      "bot"
    );

    statusEl.textContent = "Байланыс жоқ";

  } finally {
    sendButton.disabled = false;
    input.focus();
  }
});
