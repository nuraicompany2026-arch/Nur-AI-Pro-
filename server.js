const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/status", (req, res) => {
  res.json({
    status: "connected",
    name: "NUR AI PRO",
    admin: "NUR AI ADMIN"
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("NUR AI PRO іске қосылды!");
});
