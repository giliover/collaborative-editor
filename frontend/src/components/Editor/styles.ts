import styled from "styled-components";

export const EditorContainer = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  padding: 16px;
  font-size: 16px;
  font-family: "Source Code Pro", monospace;
  border: none;
  outline: none;
  resize: none;
`;
