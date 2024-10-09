import styled from "styled-components";

export const UserListContainer = styled.div`
  height: 100vh;
  width: 30rem;
  overflow-y: scroll;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  position: absolute;
  top: 0;
  right: 50px;
`;

export const UserItem = styled.div`
  margin: 8px 0;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.h3`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;
