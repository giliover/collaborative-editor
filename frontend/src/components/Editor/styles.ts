import styled from "styled-components";

export const EditorContainer = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Estilo da Div que imita o Textarea
export const DivTextarea = styled.div`
  width: 100%;
  height: 100vh;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  resize: none;
  overflow-y: auto; /* Permite a rolagem vertical */
  white-space: pre-wrap; /* Mantém as quebras de linha */
  word-wrap: break-word; /* Permite quebra de palavras para que o texto não ultrapasse a borda */
  outline: none; /* Remove a borda de foco */
  background-color: ${(props) => props.theme.colors.white};

  &:empty:before {
    content: attr(placeholder);
    color: #ccc;
  }
`;
export const HighlightsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const Highlight = styled.div`
  position: absolute;
  background-color: yellow;
  opacity: 0.4;
  pointer-events: none;
`;
