import styled from "styled-components";

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  width: 50px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  align-items: center;
  padding: 20px 0;
`;

export const IconContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 40px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1abc9c;
  }
`;
