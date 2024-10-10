import styled from "styled-components";

export const ListContainer = styled.div`
  height: 100vh;
  width: 40rem;
  overflow-y: scroll;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  position: absolute;
  top: 0;
  right: 50px;
`;

export const Title = styled.h3`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const VersionItem = styled.li`
  margin: 8px 0;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
`;

export const AuthorInfo = styled.p`
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const RevertButton = styled.button`
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;
