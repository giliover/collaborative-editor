/* eslint-disable testing-library/no-unnecessary-act */
import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@components/Editor";
import { ThemeProvider } from "styled-components";

const tokenValid =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDkwZDA3ODlkOTU4YzhhZmM1NzU4NSIsImlhdCI6MTcyODY1MjgxOCwiZXhwIjoxNzI4NzM5MjE4fQ.epdWR2rSvYaVIXUHDvVAG6eL6PtXyW1DfQAdu3FIfGk";

const theme = {
  colors: {
    white: "#ffffff",
  },
};

jest.mock("socket.io-client");

describe("Editor Component", () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
    localStorage.setItem("token", tokenValid);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders the editor with initial content", async () => {
    await act(() =>
      render(
        <MemoryRouter initialEntries={["/documents/123"]}>
          <ThemeProvider theme={theme}>
            <Editor
              userSelections={[]}
              content="Hello world"
              onChange={() => {}}
            />
          </ThemeProvider>
        </MemoryRouter>
      )
    );

    const textarea = screen.getByLabelText("textarea");
    expect(textarea.innerHTML).toBe("Hello world");
  });

  test("connects and disconnects socket on mount and unmount", async () => {
    const { unmount } = await act(() =>
      render(
        <MemoryRouter initialEntries={["/documents/123"]}>
          <ThemeProvider theme={theme}>
            <Editor
              userSelections={[]}
              content="Hello world"
              onChange={() => {}}
            />
          </ThemeProvider>
        </MemoryRouter>
      )
    );

    unmount();

    expect(io).toHaveBeenCalledWith("ws://localhost:5000", {
      auth: { token: tokenValid },
    });

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
