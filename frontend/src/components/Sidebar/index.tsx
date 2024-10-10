import React, { useState } from "react";
import { FaHistory, FaUsers } from "react-icons/fa";
import { IconButton, IconContainer, SidebarContainer } from "./styles";

const Sidebar = ({
  version: Version,
  user: User,
}: {
  user: React.FunctionComponent;
  version: React.FunctionComponent;
}) => {
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [isUsersOpen, setUsersOpen] = useState(false);

  const handleHistoryClick = () => {
    if (isUsersOpen) setUsersOpen(isHistoryOpen);
    setHistoryOpen(!isHistoryOpen);
  };

  const handleUsersClick = () => {
    if (isHistoryOpen) setHistoryOpen(isUsersOpen);
    setUsersOpen(!isUsersOpen);
  };

  return (
    <SidebarContainer>
      <IconContainer>
        <IconButton onClick={handleHistoryClick} aria-label="history">
          <FaHistory />
        </IconButton>
        <IconButton onClick={handleUsersClick} aria-label="users">
          <FaUsers />
        </IconButton>
      </IconContainer>
      {isHistoryOpen && <Version />}
      {isUsersOpen && <User />}
    </SidebarContainer>
  );
};

export default Sidebar;
