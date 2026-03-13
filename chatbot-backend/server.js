const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot backend running 🚀");
});

app.use("/api/chat", chatRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});
