const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "./build")));

app.get("*", async (_, res) => {
  try {
    res.sendFile(path.join((__dirname = "./build/index.html")));
  } catch (error) {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server ready`);
});
