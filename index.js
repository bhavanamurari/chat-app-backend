const express = require('express');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");
const { Socket } = require('socket.io');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors()); 

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Server is connected to db");
    } catch(err) {
        console.log("Server is not connected to db"); 
    }
};
connectDB();

app.get("/", (req, res) => {
    res.send("api is running");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log("Server is running..."));


const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageStatus) => {
    var chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
      chat.users.forEach((user) => {
          if (user._id == newMessageStatus.sender._id) return;
          socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
