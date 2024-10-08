import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Button,
  Input,
  Link,
  RegisterContainer,
  RegisterForm,
  RegisterTitle,
} from "./styles";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await api.post("/auth/register", { username, email, password });
      navigate("/");
    } catch (error) {
      setError("Erro ao registrar. Tente novamente.");
      console.error("Erro ao registrar", error);
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <RegisterTitle>Registrar</RegisterTitle>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <Input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <Button type="submit">Registrar</Button>
        <Link to="/">Já possui uma conta? Faça login</Link>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
