import React from "react";
import { UserListContainer, UserItem } from "./styles";

interface UserListProps {
  users: Array<{ id: string; email: string }>;
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <UserListContainer>
      <h4>Usuários Conectados</h4>
      {users.map((user) => (
        <UserItem key={user.id}>{user.email}</UserItem>
      ))}
    </UserListContainer>
  );
};

export default UserList;
