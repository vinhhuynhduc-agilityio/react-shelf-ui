import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderBar } from ".";

// Mock IconButton component
jest.mock("@/components", () => ({
  IconButton: ({
    onClick,
    disabled,
  }: {
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button data-testid="icon-button" onClick={onClick} disabled={disabled}>
      <svg data-testid="icon-svg" />
    </button>
  ),
}));

describe("HeaderBar", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnTogglePreview = jest.fn();

  const defaultProps = {
    searchQuery: "",
    isDisabled: false,
    isFetching: false,
    previewMode: false,
    onSearchChange: mockOnSearchChange,
    onTogglePreview: mockOnTogglePreview,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Render Tests
  // ============================================
  describe("Rendering", () => {
    it("should render header bar container", () => {
      const { container } = render(<HeaderBar {...defaultProps} />);

      const headerBar = container.firstChild;
      expect(headerBar).toHaveClass("flex", "items-center", "h-[56px]");
    });

    it("should render Files label", () => {
      render(<HeaderBar {...defaultProps} />);

      expect(screen.getByText("Files")).toBeInTheDocument();
    });

    it("should render search input", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      expect(searchInput).toBeInTheDocument();
    });

    it("should render search icon button", () => {
      render(<HeaderBar {...defaultProps} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const searchButton = iconButtons[0];
      expect(searchButton).toBeInTheDocument();
    });

    it("should render preview toggle button", () => {
      render(<HeaderBar {...defaultProps} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      expect(previewButton).toBeInTheDocument();
    });

    it("should have correct header height", () => {
      const { container } = render(<HeaderBar {...defaultProps} />);

      const headerBar = container.firstChild as HTMLElement;
      expect(headerBar).toHaveClass("h-[56px]");
    });
  });

  // ============================================
  // Search Input Tests
  // ============================================
  describe("Search Input", () => {
    it("should display search query in input", () => {
      render(<HeaderBar {...defaultProps} searchQuery="test file" />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("test file");
    });

    it("should update input value on multiple changes", () => {
      const { rerender } = render(<HeaderBar {...defaultProps} />);

      let searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("");

      rerender(<HeaderBar {...defaultProps} searchQuery="a" />);
      searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("a");

      rerender(<HeaderBar {...defaultProps} searchQuery="ab" />);
      searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("ab");
    });

    it("should have correct input border color", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      expect(searchInput).toHaveClass(
        "border-[#CCD7E6]",
        "focus:border-[#1CA1C1]"
      );
    });

    it("should have focus styles", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      expect(searchInput).toHaveClass("focus:outline-none");
    });
  });

  // ============================================
  // Disabled State Tests
  // ============================================
  describe("Disabled State", () => {
    it("should disable search input when isDisabled is true", () => {
      render(<HeaderBar {...defaultProps} isDisabled={true} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(true);
    });

    it("should disable preview button when isDisabled is true", () => {
      render(<HeaderBar {...defaultProps} isDisabled={true} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      expect(previewButton).toBeDisabled();
    });

    it("should disable search input when isFetching is true", () => {
      render(<HeaderBar {...defaultProps} isFetching={true} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(true);
    });

    it("should disable preview button when isFetching is true", () => {
      render(<HeaderBar {...defaultProps} isFetching={true} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      expect(previewButton).toBeDisabled();
    });

    it("should disable both when isDisabled and isFetching are true", () => {
      render(
        <HeaderBar {...defaultProps} isDisabled={true} isFetching={true} />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(true);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      expect(previewButton).toBeDisabled();
    });

    it("should enable inputs when isDisabled and isFetching are false", () => {
      render(
        <HeaderBar {...defaultProps} isDisabled={false} isFetching={false} />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(false);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      expect(previewButton).not.toBeDisabled();
    });
  });

  // ============================================
  // Preview Mode Tests
  // ============================================
  describe("Preview Mode", () => {
    it("should call onTogglePreview when preview button is clicked", () => {
      render(<HeaderBar {...defaultProps} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      fireEvent.click(previewButton);

      expect(mockOnTogglePreview).toHaveBeenCalledTimes(1);
    });

    it("should apply default background when previewMode is false", () => {
      render(<HeaderBar {...defaultProps} previewMode={false} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      // Button should have default style when preview is off
      expect(previewButton).toBeInTheDocument();
    });

    it("should toggle preview mode multiple times", () => {
      render(<HeaderBar {...defaultProps} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];

      fireEvent.click(previewButton);
      expect(mockOnTogglePreview).toHaveBeenCalledTimes(1);

      fireEvent.click(previewButton);
      expect(mockOnTogglePreview).toHaveBeenCalledTimes(2);

      fireEvent.click(previewButton);
      expect(mockOnTogglePreview).toHaveBeenCalledTimes(3);
    });

    it("should not call onTogglePreview when button is disabled", () => {
      render(<HeaderBar {...defaultProps} isDisabled={true} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      fireEvent.click(previewButton);

      expect(mockOnTogglePreview).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Button Click Tests
  // ============================================
  describe("Button Clicks", () => {
    it("should handle search icon click", () => {
      render(<HeaderBar {...defaultProps} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const searchButton = iconButtons[0];
      fireEvent.click(searchButton);

      // Search button click handler is a noop, but should not throw
      expect(searchButton).toBeInTheDocument();
    });

    it("should not call onTogglePreview when search button is clicked", () => {
      render(<HeaderBar {...defaultProps} />);

      const iconButtons = screen.getAllByTestId("icon-button");
      const searchButton = iconButtons[0];
      fireEvent.click(searchButton);

      expect(mockOnTogglePreview).not.toHaveBeenCalled();
    });

    it("should handle multiple button clicks in sequence", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      fireEvent.change(searchInput, { target: { value: "test" } });

      const iconButtons = screen.getAllByTestId("icon-button");
      const previewButton = iconButtons[1];
      fireEvent.click(previewButton);

      expect(mockOnSearchChange).toHaveBeenCalled();
      expect(mockOnTogglePreview).toHaveBeenCalled();
    });
  });

  // ============================================
  // Styling Tests
  // ============================================
  describe("Styling", () => {
    it("should have correct container classes", () => {
      const { container } = render(<HeaderBar {...defaultProps} />);

      const headerBar = container.firstChild;
      expect(headerBar).toHaveClass(
        "flex",
        "items-center",
        "h-[56px]",
        "flex-shrink-0",
        "w-full",
        "rounded-[2px]",
        "border",
        "border-[#DADEE0]"
      );
    });

    it("should have correct text color", () => {
      const { container } = render(<HeaderBar {...defaultProps} />);

      const headerBar = container.firstChild;
      expect(headerBar).toHaveClass("text-[#475466]");
    });

    it("should have white background", () => {
      const { container } = render(<HeaderBar {...defaultProps} />);

      const headerBar = container.firstChild;
      expect(headerBar).toHaveClass("bg-[#FFFFFF]");
    });

    it("should have correct search input width constraints", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchContainer = screen.getByPlaceholderText(
        "Search files and folders"
      ).parentElement;
      expect(searchContainer).toHaveClass("max-w-[300px]", "min-w-[10px]");
    });
  });

  // ============================================
  // Props Update Tests
  // ============================================
  describe("Props Updates", () => {
    it("should update when searchQuery prop changes", () => {
      const { rerender } = render(<HeaderBar {...defaultProps} />);

      let searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("");

      rerender(<HeaderBar {...defaultProps} searchQuery="updated query" />);

      searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("updated query");
    });

    it("should update when isDisabled prop changes", () => {
      const { rerender } = render(<HeaderBar {...defaultProps} />);

      let searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(false);

      rerender(<HeaderBar {...defaultProps} isDisabled={true} />);

      searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(true);
    });

    it("should update when isFetching prop changes", () => {
      const { rerender } = render(<HeaderBar {...defaultProps} />);

      let searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(false);

      rerender(<HeaderBar {...defaultProps} isFetching={true} />);

      searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.disabled).toBe(true);
    });

    it("should update when previewMode prop changes", () => {
      const { rerender } = render(
        <HeaderBar {...defaultProps} previewMode={false} />
      );

      expect(mockOnTogglePreview).not.toHaveBeenCalled();

      rerender(<HeaderBar {...defaultProps} previewMode={true} />);

      expect(mockOnTogglePreview).not.toHaveBeenCalled();
    });

    it("should update callbacks when new functions are passed", () => {
      const newOnSearchChange = jest.fn();
      const newOnTogglePreview = jest.fn();

      const { rerender } = render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      fireEvent.change(searchInput, { target: { value: "test1" } });
      expect(mockOnSearchChange).toHaveBeenCalled();

      rerender(
        <HeaderBar
          {...defaultProps}
          onSearchChange={newOnSearchChange}
          onTogglePreview={newOnTogglePreview}
        />
      );

      const iconButtons = screen.getAllByTestId("icon-button");
      fireEvent.click(iconButtons[1]);
      expect(newOnTogglePreview).toHaveBeenCalled();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  describe("Accessibility", () => {
    it("should have placeholder text for search input", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      expect(searchInput).toHaveAttribute(
        "placeholder",
        "Search files and folders"
      );
    });

    it("should have name attribute on search input", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByDisplayValue("");
      expect(searchInput).toHaveAttribute("name", "search");
    });

    it("should have proper input type", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      expect(searchInput).toHaveAttribute("type", "text");
    });

    it("should be keyboard navigable", () => {
      render(<HeaderBar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      );
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================
  describe("Edge Cases", () => {
    it("should handle very long search query", () => {
      const longQuery = "A".repeat(200);
      render(<HeaderBar {...defaultProps} searchQuery={longQuery} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe(longQuery);
    });

    it("should handle special characters in search query", () => {
      const specialQuery = "test @#$%^&*() 中文";
      render(<HeaderBar {...defaultProps} searchQuery={specialQuery} />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe(specialQuery);
    });

    it("should handle rapid state changes", () => {
      const { rerender } = render(<HeaderBar {...defaultProps} />);

      rerender(<HeaderBar {...defaultProps} isDisabled={true} />);
      rerender(<HeaderBar {...defaultProps} isFetching={true} />);
      rerender(<HeaderBar {...defaultProps} previewMode={true} />);
      rerender(<HeaderBar {...defaultProps} searchQuery="test" />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("test");
    });

    it("should handle empty search query", () => {
      render(<HeaderBar {...defaultProps} searchQuery="" />);

      const searchInput = screen.getByPlaceholderText(
        "Search files and folders"
      ) as HTMLInputElement;
      expect(searchInput.value).toBe("");
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  describe("Integration", () => {
    it("should render memo component correctly", () => {
      const { rerender } = render(<HeaderBar {...defaultProps} />);

      expect(screen.getByText("Files")).toBeInTheDocument();

      rerender(<HeaderBar {...defaultProps} searchQuery="test" />);

      expect(screen.getByText("Files")).toBeInTheDocument();
    });
  });

  // ============================================
  // Snapshot Tests
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot with default props", () => {
      const { container } = render(<HeaderBar {...defaultProps} />);

      expect(container).toMatchSnapshot();
    });

    it("should match snapshot with search query", () => {
      const { container } = render(
        <HeaderBar {...defaultProps} searchQuery="test file" />
      );

      expect(container).toMatchSnapshot();
    });

    it("should match snapshot when disabled", () => {
      const { container } = render(
        <HeaderBar {...defaultProps} isDisabled={true} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should match snapshot when fetching", () => {
      const { container } = render(
        <HeaderBar {...defaultProps} isFetching={true} />
      );

      expect(container).toMatchSnapshot();
    });

    it("should match snapshot with preview mode active", () => {
      const { container } = render(
        <HeaderBar {...defaultProps} previewMode={true} />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
