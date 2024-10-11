/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */

import React, { act } from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom/extend-expect";
import VersionList from "@components/VersionList";
import api from "@services/api";
import { getUserIdAndToken } from "@global/getUserIdAndToken";
import axios from "axios";

jest.mock("axios");
jest.mock("../../src/global/getUserIdAndToken");

const theme = {
  colors: {
    white: "#ffffff",
  },
};

const mockedApi = api as jest.Mocked<typeof api>;
axios as jest.Mocked<typeof axios>;

describe("VersionList component", () => {
  const mockDocumentId = "document123";
  const mockOnRevert = jest.fn();

  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  beforeEach(() => {
    (getUserIdAndToken as jest.Mock).mockReturnValue({
      userId: "user123",
      token: "mock-token",
    });
  });

  it("should handle revert action correctly", async () => {
    mockedApi.get.mockResolvedValue({
      data: [
        {
          _id: "version1",
          content: "Version 1 content",
          timestamp: "2023-10-10T12:00:00Z",
          author: { _id: "author1", email: "author1@example.com" },
        },
      ],
    });

    mockedApi.post.mockResolvedValue({
      data: { content: "Reverted content" },
    });

    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <VersionList documentId={mockDocumentId} onRevert={mockOnRevert} />
        </ThemeProvider>
      )
    );

    await waitFor(() => {
      expect(screen.getByText("author1@example.com")).toBeInTheDocument();
    });

    const revertButton = screen.getByText("Reverter");
    fireEvent.click(revertButton);

    await waitFor(() => {
      expect(mockOnRevert).toHaveBeenCalledWith("Reverted content");
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      `/documents/${mockDocumentId}/versions/version1/revert`,
      { userId: "user123" }
    );
  });
});
