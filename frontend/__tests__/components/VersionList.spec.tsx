/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */

import React, { act } from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import VersionList from "../../src/components/VersionList";
import api from "../../src/services/api";
import { getUserIdAndToken } from "../../src/global/getUserIdAndToken";
import { ThemeProvider } from "styled-components";

jest.mock("../../src/services/api");
jest.mock("../../src/global/getUserIdAndToken");

const theme = {
  colors: {
    white: "#ffffff",
  },
};

const mockedApi = api as jest.Mocked<typeof api>;

describe("VersionList component", () => {
  const mockDocumentId = "document123";
  const mockOnRevert = jest.fn();

  beforeEach(() => {
    (getUserIdAndToken as jest.Mock).mockReturnValue({ userId: "user123" });
  });

  it("should fetch and display versions correctly", async () => {
    mockedApi.get.mockResolvedValue({
      data: [
        {
          _id: "version1",
          content: "Version 1 content",
          timestamp: "2023-10-10T12:00:00Z",
          author: { _id: "author1", email: "author1@example.com" },
        },
        {
          _id: "version2",
          content: "Version 2 content",
          timestamp: "2023-10-09T12:00:00Z",
          author: { _id: "author2", email: "author2@example.com" },
        },
      ],
    });

    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <VersionList documentId={mockDocumentId} onRevert={mockOnRevert} />
        </ThemeProvider>
      )
    );

    expect(screen.getByText("Histórico de Versões")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("author1@example.com")).toBeInTheDocument();
      expect(screen.getByText("author2@example.com")).toBeInTheDocument();
    });

    expect(screen.getByText("10/10/2023, 12:00:00 PM")).toBeInTheDocument();
    expect(screen.getByText("09/10/2023, 12:00:00 PM")).toBeInTheDocument();
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
