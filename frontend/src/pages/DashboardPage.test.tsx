import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders executive metrics", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Total Events")).toBeInTheDocument();
    expect(screen.getByText("Attendance Trend")).toBeInTheDocument();
  });
});
