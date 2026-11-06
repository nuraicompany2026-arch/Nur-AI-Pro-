
const keyInput = document.getElementById("key");
const commandInput = document.getElementById("command");
const result = document.getElementById("result");
const runButton = document.getElementById("run");

runButton.addEventListener("click", async () => {

  const key = keyInput.value.trim();
  const command = commandInput.value.trim();

  if (!key || !command) {
    result.textContent =
      "Әкімші кілті мен команданы толтыр.";
    return;
  }

  runButton.disabled = true;
  result.textContent = "Орындалып жатыр...";

  try {

    const response = await fetch(
      "/admin/command",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key
        },

        body: JSON.stringify({
          command
        })
      }
    );

    const data = await response.json();

    result.textContent =
      data.message || "Нәтиже жоқ.";

  } catch (error) {

    result.textContent =
      "Сервермен байланыс жоқ.";

  } finally {

    runButton.disabled = false;

  }
});
