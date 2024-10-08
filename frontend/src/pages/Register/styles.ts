import styled from "styled-components";

import { Link as RouterLink } from "react-router-dom";

export const Link = styled(RouterLink)`
  display: block;
  margin-top: 16px;
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${(props) => props.theme.colors.background};
`;

export const RegisterForm = styled.form`
  width: 400px;
  padding: 32px;
  background: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const RegisterTitle = styled.h2`
  margin-bottom: 24px;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;
