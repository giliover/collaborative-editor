import React from "react";
import ReactMarkdown from "react-markdown";
import { MarkdownContent, PreviewContainer } from "./styles";

interface PreviewProps {
  content: string;
}

const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <PreviewContainer>
      <MarkdownContent>
        <ReactMarkdown>{content}</ReactMarkdown>
      </MarkdownContent>
    </PreviewContainer>
  );
};

export default Preview;
