import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MenuSidebar from "../MenuSidebar";

// Mock logo image import
jest.mock("@/assets/images/logo.webp", () => "logo.webp");

const mockSetSearchTerm = jest.fn();
const mockSetSearchFromSidebar = jest.fn();
const mockSetValueSearch = jest.fn();

jest.mock("@/stores", () => ({
  useSearchStore: (
    selector: (store: {
      setSearchTerm: typeof mockSetSearchTerm;
      setSearchFromSidebar: typeof mockSetSearchFromSidebar;
      setValueSearch: typeof mockSetValueSearch;
    }) => unknown
  ) =>
    selector({
      setSearchTerm: mockSetSearchTerm,
      setSearchFromSidebar: mockSetSearchFromSidebar,
      setValueSearch: mockSetValueSearch,
    }),
}));

jest.mock("@/stores/search.ts", () => ({
  useSearchStore: jest.fn(),
}));

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

  it("calls zustand actions when clicking on 'search'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MenuSidebar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Search"));

    expect(mockSetSearchFromSidebar).toHaveBeenCalledWith(true);
    expect(mockSetSearchTerm).toHaveBeenCalledWith("");
    expect(mockSetValueSearch).toHaveBeenCalledWith("");
  });
});
