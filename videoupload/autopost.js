const express = require("express");
const uploadHandelerManager = require(".");
const app = express();
const port = process.env.PORT || 3000;

//get
app.get("/", (req, res) => res.send("OK"));

//script
uploadHandelerManager();

app.listen(port, () => console.log(`AutoPost Server Running`));