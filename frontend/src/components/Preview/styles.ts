import styled from "styled-components";

export const PreviewContainer = styled.div`
  width: 50%;
  height: 100vh;
  overflow-y: scroll;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.background};
`;

export const MarkdownContent = styled.div`
  font-size: 16px;
  line-height: 1.6;

  h1 {
    font-size: 2em;
    margin-top: 0.67em;
    margin-bottom: 0.67em;
  }

  h2 {
    font-size: 1.5em;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
  }

  p {
    margin-bottom: 1em;
  }
`;
