const keyInput = document.getElementById("key");
const commandInput = document.getElementById("command");
const result = document.getElementById("result");
const runButton = document.getElementById("run");

async function runCommand(command) {
  const key = keyInput.value.trim();

  if (!key || !command) {
    result.textContent = "Әкімші кілті мен команданы толтыр.";
    return;
  }

  runButton.disabled = true;
  result.textContent = "Команда орындалып жатыр...";

  try {
    const response = await fetch("/admin/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key
      },
      body: JSON.stringify({ command })
    });

    const data = await response.json();

    result.textContent = data.message || "Нәтиже жоқ.";

    if (!response.ok) {
      result.textContent += "\nHTTP: " + response.status;
    }
  } catch (error) {
    result.textContent = "Сервермен байланыс жоқ.";
  } finally {
    runButton.disabled = false;
  }
}

runButton.addEventListener("click", () => {
  runCommand(commandInput.value.trim());
});

commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCommand(commandInput.value.trim());
  }
});
