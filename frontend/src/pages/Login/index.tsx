import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Button,
  Input,
  Link,
  LoginContainer,
  LoginForm,
  LoginTitle,
} from "./styles";
import UserValidator from "../../validators/UserValidator";
import DocumentValidator from "../../validators/DocumentValidator";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createDocument = async (payload: { title: string }) => {
    try {
      const payloadValid = await DocumentValidator.validate(payload);
      const docRes = await api.post("/documents", payloadValid);
      const documentId = docRes.data._id;

      navigate(`/documents/${documentId}`);
      return;
    } catch (error: any) {
      console.error(error.response.data.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { email, password };
      const payloadValid = await UserValidator.validate(payload);
      const res = await api.post("/auth/login", payloadValid);
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      const docRes = await api.get("/documents/my-document");
      const documentId = docRes.data._id;
      navigate(`/documents/${documentId}`);
    } catch (error: any) {
      if (!error.includes("Erro ao obter documento")) return;

      const payload = {
        title: "Novo documento",
      };

      await createDocument(payload);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Login</LoginTitle>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
        <Link to="/register">Registrar-se</Link>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
