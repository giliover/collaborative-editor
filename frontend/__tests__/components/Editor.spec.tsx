/* eslint-disable testing-library/no-unnecessary-act */
import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@components/Editor";

jest.mock("socket.io-client");

describe("Editor Component", () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
      disconnect: jest.fn(),
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders the editor with initial content", async () => {
    await act(() =>
      render(
        <MemoryRouter initialEntries={["/documents/123"]}>
          <Editor content="Hello world" onChange={() => {}} />
        </MemoryRouter>
      )
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea.innerHTML).toBe("Hello world");
  });

  test("calls onChange when user types", () => {
    const handleChange = jest.fn();

    act(() =>
      render(
        <MemoryRouter initialEntries={["/documents/123"]}>
          <Editor content="Hello world" onChange={handleChange} />
        </MemoryRouter>
      )
    );

    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "New content" } });

    expect(handleChange).toHaveBeenCalledWith("New content");
  });

  test("emits user_typing event when user selects text", () => {
    act(() =>
      render(
        <MemoryRouter initialEntries={["/documents/123"]}>
          <Editor content="Hello world" onChange={() => {}} />
        </MemoryRouter>
      )
    );

    const textarea = screen.getByRole("textbox");

    fireEvent.select(textarea);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "user_typing",
      expect.any(Object)
    );
  });

  test("connects and disconnects socket on mount and unmount", async () => {
    const { unmount } = await act(() =>
      render(
        <MemoryRouter initialEntries={["/documents/123"]}>
          <Editor content="Hello world" onChange={() => {}} />
        </MemoryRouter>
      )
    );

    unmount();

    expect(io).toHaveBeenCalledWith("ws://localhost:5000", {
      auth: { token: "mock-token" },
    });

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
