import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Editor from "../../components/Editor";
import Preview from "../../components/Preview";
import UserList from "../../components/UserList";
import { DocumentPageContainer } from "./styles";

let socket: Socket;

const DocumentPage: React.FC = () => {
  const { id } = useParams();
  const [content, setContent] = useState(
    "# Título do Documento\n\nEste é o conteúdo do documento de exemplo."
  );
  const [users, setUsers] = useState<Array<{ id: string; username: string }>>([
    {
      id: "user-1",
      username: "Usuário Teste",
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    socket = io("http://localhost:5000", {
      auth: { token },
    });

    socket.emit("join_document", { documentId: id });

    socket.on("load_document", (documentContent) => {
      setContent(documentContent);
    });

    socket.on("document_update", ({ content: updatedContent }) => {
      setContent(updatedContent);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    socket.emit("document_change", { documentId: id, content: newContent });
  };

  useEffect(() => {
    socket.on("user_joined", ({ userId, username }) => {
      setUsers((prevUsers) => [...prevUsers, { id: userId, username }]);
    });

    socket.on("user_left", ({ userId }) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  return (
    <DocumentPageContainer>
      <Editor content={content} onChange={handleContentChange} />
      <Preview content={content} />
      <UserList users={users} />
    </DocumentPageContainer>
  );
};

export default DocumentPage;
