const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("App is runing"));

app.listen(4000, () => console.log("Server is runing on port 4000"));
