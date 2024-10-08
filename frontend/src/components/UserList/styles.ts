import styled from "styled-components";

export const UserListContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 10px;
  right: 10px;
  background: ${(props) => props.theme.colors.white};
  padding: 16px;
  border-bottom-left-radius: 8px;
  box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.1);
`;

export const UserItem = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
`;
