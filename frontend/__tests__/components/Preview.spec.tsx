/* eslint-disable testing-library/no-unnecessary-act */
import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Preview from "../../src/components/Preview";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    white: "#ffffff",
  },
};

jest.mock("react-markdown", () => {
  return ({ children }: { children: React.ReactNode }) => (
    <div aria-label="heading">{children}</div>
  );
});

describe("Preview component", () => {
  it("renders markdown content correctly", () => {
    const markdownContent =
      "# Heading 1\n\nThis is a paragraph with **bold text**.";

    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <Preview content={markdownContent} />
        </ThemeProvider>
      )
    );

    const element = screen.getByLabelText(/heading/i);
    const html = element.innerHTML;

    expect(html).toBe(markdownContent);
    expect(element).toBeInTheDocument();
  });

  it("renders an empty preview without content", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <Preview content="" />
        </ThemeProvider>
      )
    );

    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
});
