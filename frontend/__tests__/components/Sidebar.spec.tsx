/* eslint-disable testing-library/no-unnecessary-act */
import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Sidebar from "../../src/components/Sidebar";
import { ThemeProvider } from "styled-components";

const MockVersion = () => <div>Version Component</div>;
const MockUser = () => <div>User Component</div>;

const theme = {
  colors: {
    white: "#ffffff",
  },
};

describe("Sidebar component", () => {
  it("should render without crashing", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <Sidebar user={MockUser} version={MockVersion} />
        </ThemeProvider>
      )
    );

    expect(screen.getByLabelText(/history/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/users/i)).toBeInTheDocument();
  });

  it("should toggle the Version component when the history button is clicked", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <Sidebar user={MockUser} version={MockVersion} />
        </ThemeProvider>
      )
    );

    fireEvent.click(screen.getByLabelText(/history/i));

    expect(screen.getByText(/version component/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/history/i));
    expect(screen.queryByText(/version component/i)).not.toBeInTheDocument();
  });

  it("should toggle the User component when the users button is clicked", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <Sidebar user={MockUser} version={MockVersion} />
        </ThemeProvider>
      )
    );

    fireEvent.click(screen.getByLabelText(/users/i));

    expect(screen.getByText(/user component/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/users/i));
    expect(screen.queryByText(/user component/i)).not.toBeInTheDocument();
  });

  it("should close one panel when the other is opened", () => {
    act(() =>
      render(
        <ThemeProvider theme={theme}>
          <Sidebar user={MockUser} version={MockVersion} />
        </ThemeProvider>
      )
    );

    fireEvent.click(screen.getByLabelText(/history/i));
    expect(screen.getByText(/version component/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/users/i));

    expect(screen.queryByText(/version component/i)).not.toBeInTheDocument();
    expect(screen.getByText(/user component/i)).toBeInTheDocument();
  });
});
