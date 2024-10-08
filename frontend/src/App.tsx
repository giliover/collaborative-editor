import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "./global/theme";
import GlobalStyle from "./global/style";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
