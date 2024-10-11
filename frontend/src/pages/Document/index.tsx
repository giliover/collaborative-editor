import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Editor from "@components/Editor";
import Preview from "@components/Preview";
import UserList from "@components/UserList";
import { DocumentPageContainer } from "./styles";
import VersionList from "@components/VersionList";
import { getUserIdAndToken } from "@global/getUserIdAndToken";
import Sidebar from "@components/Sidebar";

let socket: Socket;

export interface UserSelection {
  userId: string;
  documentId: string;
  positionStart: number;
  positionEnd: number;
}

const DocumentPage: React.FC = () => {
  const { id } = useParams();
  const { userId, token } = getUserIdAndToken();
  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);

  const [content, setContent] = useState(
    "# Título do Documento\n\nEste é o conteúdo do documento de exemplo."
  );
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (newContent !== content) {
      socket.emit("document_change", {
        documentId: id,
        content: newContent,
        userId,
      });
    }
  };

  useEffect(() => {
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

    socket.on("user_selection", (data: UserSelection) => {
      setUserSelections((prevSelections) => {
        const updatedSelections = prevSelections.filter(
          (sel) => sel.userId !== data.userId
        );
        return [...updatedSelections, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [id, token, userId]);

  const handleRevert = (content: string) => {
    socket = io("ws://localhost:5000", {
      auth: { token },
    });
    const { userId } = getUserIdAndToken();

    setContent(content);
    socket.emit("document_change", { documentId: id, content, userId });
  };

  return (
    <DocumentPageContainer>
      <Sidebar
        version={() => <VersionList documentId={id!} onRevert={handleRevert} />}
        user={() => <UserList users={users} />}
      />

      <Editor
        userSelections={userSelections}
        content={content}
        onChange={handleContentChange}
      />
      <Preview content={content} />
    </DocumentPageContainer>
  );
};

export default DocumentPage;
