import React from "react";
import { useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { EditorContainer, TextArea } from "./styles";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

let socket: Socket;

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id } = useParams();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    socket = io("ws://localhost:5000", {
      auth: { token },
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleSelectionChange = () => {
    const position = textareaRef.current?.selectionStart;
    socket.emit("user_typing", { position });
  };

  return (
    <EditorContainer>
      <TextArea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelectionChange}
      />
    </EditorContainer>
  );
};

export default Editor;
