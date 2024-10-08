import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Editor from "../../components/Editor";
import Preview from "../../components/Preview";
import UserList from "../../components/UserList";
import { DocumentPageContainer } from "./styles";
import * as jwt_decode from "jwt-decode";

let socket: Socket;

const DocumentPage: React.FC = () => {
  const { id } = useParams();
  const [content, setContent] = useState(
    "# Título do Documento\n\nEste é o conteúdo do documento de exemplo."
  );
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);

  const getUserIdAndToken = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("");
    const decodedToken = jwt_decode.jwtDecode(token as string) as any;
    return { token, userId: decodedToken.id };
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    socket.emit("document_change", { documentId: id, content: newContent });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const { userId } = getUserIdAndToken();

    socket = io("ws://localhost:5000", {
      auth: { token },
    });

    socket.emit("join_document", { documentId: id, userId });

    socket.on("load_document", (documentContent) => {
      if (documentContent.length) return setContent(documentContent);
      setContent(
        "# Título do Documento\n\nEste é o conteúdo do documento de exemplo."
      );
    });

    socket.on("document_update", ({ content: updatedContent }) => {
      setContent(updatedContent);
    });

    socket.on("update_user_list", (userList) => {
      setUsers(userList);
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
