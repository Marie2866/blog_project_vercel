const express = require("express");
const { Logger } = require("mongodb");
const app = express();

app.use(express.json());
app.use(Logger);

app.listen(3000, () => console.log("Listening on : 3000"));
