import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MenuSidebar from "../MenuSidebar";

// Mock logo image import
jest.mock("@/assets/images/logo.webp", () => "logo.webp");

describe("MenuSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders menu items", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MenuSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });
});
