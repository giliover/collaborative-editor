import React, { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import {
  DivTextarea,
  EditorContainer,
  Highlight,
  HighlightsContainer,
} from "./styles";
import { UserSelection } from "@/pages/Document";
import { getUserIdAndToken } from "@/global/getUserIdAndToken";

// Função para debounce
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  userSelections: UserSelection[];
}

let socket: Socket;

const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  userSelections,
}) => {
  const textareaRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { userId, token } = getUserIdAndToken();
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    socket = io("ws://localhost:5000", {
      auth: { token },
    });

    return () => {
      socket.disconnect();
    };
  }, [id, token]);

  // Função para salvar a posição do cursor
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;
      selectionRef.current = { start, end };
    }
  };

  // Função para restaurar a posição do cursor
  const restoreCursorPosition = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    const textNode = textareaRef.current?.firstChild;

    if (selectionRef.current && textNode) {
      const { start, end } = selectionRef.current;
      range.setStart(textNode, start);
      range.setEnd(textNode, end);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // Debounced handleInputChange para evitar re-renderizações rápidas
  const debouncedHandleInputChange = debounce(() => {
    saveCursorPosition(); // Salva a posição do cursor
    onChange(textareaRef.current?.innerText || ""); // Atualiza o conteúdo
    setTimeout(restoreCursorPosition, 0); // Restaura a posição do cursor após a renderização
  }, 200);

  const handleInputChange = () => {
    debouncedHandleInputChange(); // Chama a versão com debounce
  };

  // Função personalizada para lidar com "Enter"
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previne o comportamento padrão de "Enter"
      document.execCommand("insertLineBreak"); // Insere uma quebra de linha personalizada
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const positionStart = range.startOffset;
      const positionEnd = range.endOffset;

      if (positionStart !== null && positionEnd !== null) {
        socket.emit("user_typing", {
          positionStart,
          positionEnd,
          userId,
          documentId: id,
        });
      }
    }
  };

  const renderHighlights = () => {
    return userSelections.map((selection, index) => {
      const selectionRange = document.createRange();
      const contentElement = textareaRef.current;

      if (contentElement) {
        const textNode = contentElement.childNodes[0];
        if (textNode) {
          if (selection.userId.includes(userId)) return null;
          selectionRange.setStart(textNode, selection.positionStart);
          selectionRange.setEnd(textNode, selection.positionEnd);

          const rect = selectionRange.getBoundingClientRect();

          return (
            <Highlight
              key={index}
              role="textbox"
              aria-multiline="true"
              style={{
                position: "absolute",
                left: `${rect.left}px`,
                top: `${rect.top + window.scrollY}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                backgroundColor: "yellow",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            ></Highlight>
          );
        }
      }

      return null;
    });
  };

  return (
    <EditorContainer>
      <HighlightsContainer>{renderHighlights()}</HighlightsContainer>

      <DivTextarea
        aria-label="textarea"
        ref={textareaRef}
        suppressContentEditableWarning={true}
        contentEditable={true}
        onInput={handleInputChange}
        onMouseUp={handleSelectionChange}
        onKeyDown={handleKeyDown} // Lidando com o Enter
      >
        {content}
      </DivTextarea>
    </EditorContainer>
  );
};

export default Editor;
