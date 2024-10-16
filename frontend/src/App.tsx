import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Document from "@pages/Document";
import { ThemeProvider } from "styled-components";
import { theme } from "@global/theme";
import GlobalStyle from "@global/style";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documents/:id" element={<Document />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
