const app = require("express")();
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
require("dotenv/config");

const chapter = require("./routes/chapters");
app.use("/chapters", chapter);

const audiobook = require("./routes/audioBook");
app.use("/audiobooks", audiobook);

app.get("/", (req, res) => {
  res.send("API for AudioBook 👉 localhost:3000/audiobook");
});

mongoose.connect(process.env.DB, () => {
  console.log("Connected to DB");
});

app.listen(3000);
