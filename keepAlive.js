const express = require("express");
const app = express();

// Route principale pour le keepAlive
app.get("/", (req, res) => {
  res.send("Bot actif !");
});

// Render fournit automatiquement la variable PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur keepAlive actif sur le port ${port}`);
});