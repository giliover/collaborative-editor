import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import documentRoutes from "./routes/documents";
import Document from "./models/Document";
import User from "./models/User";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(String(process.env.MONGO_URI));

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

io.on("connection", (socket) => {
  console.log("Um usuário se conectou:", socket.id);

  socket.on("join_document", async ({ documentId, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      socket.emit("error", "ID de documento inválido");
      return;
    }

    socket.join(documentId);

    const document = await Document.findById(documentId);
    const user = await User.findById(userId);

    if (document && user) {
      socket.emit("load_document", document.content);

      socket.data.userId = userId;
      socket.data.email = user.email;

      const sockets = await io.in(documentId).fetchSockets();
      const userList = sockets.map((s) => ({
        id: s.data.userId,
        email: s.data.email,
      }));

      io.in(documentId).emit("update_user_list", userList);

      console.log(`Usuário ${user.email} entrou no documento ${documentId}`);
    } else {
      socket.emit("error", "Documento ou usuário não encontrado");
    }
  });

  socket.on("disconnecting", async () => {
    const rooms = Array.from(socket.rooms);
    for (const room of rooms) {
      if (room !== socket.id) {
        const sockets = await io.in(room).fetchSockets();
        const userList = sockets
          .filter((s) => s.id !== socket.id)
          .map((s) => ({
            id: s.data.userId,
            email: s.data.email,
          }));

        io.in(room).emit("update_user_list", userList);

        console.log(`Usuário ${socket.data.email} saiu do documento ${room}`);
      }
    }
  });

  socket.on("document_change", async ({ documentId, content, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      socket.emit("error", "ID de documento inválido");
      return;
    }

    const document = await Document.findById(documentId);
    if (document) {
      document.versions.push({
        content: document.content,
        author: userId,
        timestamp: new Date(),
      });

      document.content = content;
      await document.save();

      socket.to(documentId).emit("document_update", { content });
    } else {
      socket.emit("error", "Documento não encontrado");
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
