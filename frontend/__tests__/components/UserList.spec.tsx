/* eslint-disable testing-library/no-unnecessary-act */
import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserList from "@components/UserList";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    white: "#ffffff",
  },
};

describe("UserList component", () => {
  it("renders the title", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <UserList users={[]} />
        </ThemeProvider>
      )
    );

    expect(screen.getByText("Usuários Conectados")).toBeInTheDocument();
  });

  it("renders the list of users correctly", () => {
    const users = [
      { id: "1", email: "user1@example.com" },
      { id: "2", email: "user2@example.com" },
      { id: "3", email: "user3@example.com" },
    ];

    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <UserList users={users} />
        </ThemeProvider>
      )
    );

    users.forEach((user) => {
      expect(screen.getByText(user.email)).toBeInTheDocument();
    });
  });

  it("renders no users when the user list is empty", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <UserList users={[]} />
        </ThemeProvider>
      )
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
