import { render, screen, fireEvent } from "@testing-library/react";
import { useWindowStore } from "@/stores";
import WindowHeader from "@/components/common/WindowHeader";

// Mock stores and components
jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));
jest.mock("@/components", () => ({
  IconButton: ({ icon, onClick }: { icon: string; onClick?: () => void }) => (
    <button
      data-testid={`icon-${String(icon).replace(/\s+/g, "-")}`}
      onClick={onClick}
    />
  ),
}));

const mockedUseWindowStore = useWindowStore as unknown as jest.Mock;

describe("WindowHeader", () => {
  const sampleProps = {
    windowKey: "spreadsheet" as const,
    src: "/images/spreadsheet.png",
    title: "Spreadsheet",
    onClose: jest.fn(),
    onMaximize: jest.fn(),
    onMinimize: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders title and icon image and calls minimize/maximize/close callbacks", () => {
    // return not maximized state
    mockedUseWindowStore.mockImplementation(() => ({
      win: { isMaximized: false },
    }));

    render(<WindowHeader {...sampleProps} />);

    // image & title
    const img = screen.getByAltText("Spreadsheet") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/images/spreadsheet.png");
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();

    // buttons (icons normalized to testid)
    const minusBtn = screen.getByTestId("icon-fa-solid-fa-minus");
    const squareBtn = screen.getByTestId("icon-fa-regular-fa-square");
    const closeBtn = screen.getByTestId("icon-fa-solid-fa-xmark");

    fireEvent.click(minusBtn);
    fireEvent.click(squareBtn);
    fireEvent.click(closeBtn);

    expect(sampleProps.onMinimize).toHaveBeenCalledTimes(1);
    expect(sampleProps.onMaximize).toHaveBeenCalledTimes(1);
    expect(sampleProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("renders restore icon when window is maximized", () => {
    mockedUseWindowStore.mockImplementation(() => ({
      win: { isMaximized: true },
    }));

    render(<WindowHeader {...sampleProps} />);

    // middle button should be the restore icon when maximized
    expect(
      screen.queryByTestId("icon-fa-regular-fa-square")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("icon-fa-regular-fa-window-restore")
    ).toBeInTheDocument();
  });
});
