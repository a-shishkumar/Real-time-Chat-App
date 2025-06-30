const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

const socket = require("socket.io");
app.get("/api/avatar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const avatarUrl = `https://api.multiavatar.com/${id}.svg`;
    const response = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching avatar:", error);
    res.status(500).send("Error fetching avatar");
  }
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
