import React from "react";
import { UserListContainer, UserItem, Title } from "./styles";

interface UserListProps {
  users: Array<{ id: string; email: string }>;
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <UserListContainer>
      <Title>Usuários Conectados</Title>
      {users.map((user) => (
        <UserItem key={user.id}>{user.email}</UserItem>
      ))}
    </UserListContainer>
  );
};

export default UserList;
