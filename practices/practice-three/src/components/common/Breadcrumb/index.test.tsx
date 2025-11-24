import { render, screen, fireEvent } from "@testing-library/react";
import Breadcrumb from ".";
import type { BreadcrumbItem } from "@/types";

describe("Breadcrumb", () => {
  const mockBreadcrumbPath: BreadcrumbItem[] = [
    { id: "root", name: "Home" },
    { id: "folder-1", name: "Documents" },
    { id: "folder-2", name: "Projects" },
    { id: "folder-3", name: "React" },
  ];

  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Render Tests
  // ============================================
  describe("Rendering", () => {
    it("should render all breadcrumb items", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Documents")).toBeInTheDocument();
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("should render separators between items", () => {
      const { container } = render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const separators = container.querySelectorAll("span[aria-hidden='true']");
      expect(separators.length).toBe(mockBreadcrumbPath.length - 1);
    });

    it("should render correct number of separators", () => {
      const shortPath: BreadcrumbItem[] = [
        { id: "root", name: "Home" },
        { id: "folder-1", name: "Documents" },
      ];

      const { container } = render(
        <Breadcrumb
          path={shortPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-1"
        />
      );

      const separators = container.querySelectorAll("span[aria-hidden='true']");
      expect(separators.length).toBe(1);
    });

    it("should render single item without separator", () => {
      const singlePath: BreadcrumbItem[] = [{ id: "root", name: "Home" }];

      const { container } = render(
        <Breadcrumb
          path={singlePath}
          onNavigate={mockOnNavigate}
          currentFolderId="root"
        />
      );

      const separators = container.querySelectorAll("span[aria-hidden='true']");
      expect(separators.length).toBe(0);
    });

    it("should render empty breadcrumb when path is empty", () => {
      const { container } = render(
        <Breadcrumb path={[]} onNavigate={mockOnNavigate} currentFolderId="" />
      );

      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });
  });

  // ============================================
  // Current Item Tests
  // ============================================
  describe("Current Item Behavior", () => {
    it("should mark last item as current page", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const currentItem = screen.getByText("React");
      expect(currentItem).toHaveAttribute("aria-current", "page");
    });

    it("should render current item as span (not button)", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const currentItem = screen.getByText("React");
      expect(currentItem.tagName).toBe("SPAN");
    });

    it("should render non-current items as buttons", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const homeButton = screen.getByText("Home");
      const documentsButton = screen.getByText("Documents");
      const projectsButton = screen.getByText("Projects");

      expect(homeButton.tagName).toBe("BUTTON");
      expect(documentsButton.tagName).toBe("BUTTON");
      expect(projectsButton.tagName).toBe("BUTTON");
    });

    it("should correctly identify current item in middle of path", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-1"
        />
      );

      const currentItem = screen.getByText("Documents");
      expect(currentItem).toHaveAttribute("aria-current", "page");
      expect(currentItem.tagName).toBe("SPAN");

      const projectsButton = screen.getByText("Projects");
      expect(projectsButton.tagName).toBe("BUTTON");
    });
  });

  // ============================================
  // Click Handler Tests
  // ============================================
  describe("Navigation", () => {
    it("should call onNavigate when clickable item is clicked", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const homeButton = screen.getByText("Home");
      fireEvent.click(homeButton);

      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
      expect(mockOnNavigate).toHaveBeenCalledWith("root");
    });

    it("should not call onNavigate when current item is clicked", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const currentItem = screen.getByText("React");
      fireEvent.click(currentItem);

      expect(mockOnNavigate).not.toHaveBeenCalled();
    });

    it("should call onNavigate with correct folder ID for each item", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const documentsButton = screen.getByText("Documents");
      fireEvent.click(documentsButton);

      expect(mockOnNavigate).toHaveBeenCalledWith("folder-1");

      const projectsButton = screen.getByText("Projects");
      fireEvent.click(projectsButton);

      expect(mockOnNavigate).toHaveBeenCalledWith("folder-2");
    });

    it("should handle multiple clicks on different items", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      fireEvent.click(screen.getByText("Home"));
      fireEvent.click(screen.getByText("Documents"));
      fireEvent.click(screen.getByText("Projects"));

      expect(mockOnNavigate).toHaveBeenCalledTimes(3);
      expect(mockOnNavigate).toHaveBeenNthCalledWith(1, "root");
      expect(mockOnNavigate).toHaveBeenNthCalledWith(2, "folder-1");
      expect(mockOnNavigate).toHaveBeenNthCalledWith(3, "folder-2");
    });
  });

  // ============================================
  // Styling Tests
  // ============================================
  describe("Styling & CSS Classes", () => {
    it("should apply default styles to nav element", () => {
      const { container } = render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("flex", "items-center", "space-x-1");
    });

    it("should apply custom breadcrumb styles", () => {
      const { container } = render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
          breadcrumbStyles="custom-class"
        />
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("custom-class");
    });

    it("should apply correct classes to clickable buttons", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const homeButton = screen.getByText("Home");
      expect(homeButton).toHaveClass("cursor-pointer");
      expect(homeButton).toHaveClass("hover:text-[#1CA1C1]");
    });

    it("should apply correct classes to current item", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const currentItem = screen.getByText("React");
      expect(currentItem).toHaveClass("text-[#475466]");
      expect(currentItem).not.toHaveClass("cursor-pointer");
    });

    it("should apply separator styling", () => {
      const { container } = render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const separators = container.querySelectorAll("span[aria-hidden='true']");
      separators.forEach((separator) => {
        expect(separator).toHaveClass("text-[#94A1B3]");
      });
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  describe("Accessibility", () => {
    it("should have proper nav role", () => {
      const { container } = render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const nav = container.querySelector("nav");
      expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
    });

    it("should have aria-current on current page item", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const currentItem = screen.getByText("React");
      expect(currentItem).toHaveAttribute("aria-current", "page");
    });

    it("should hide separators from screen readers", () => {
      const { container } = render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const separators = container.querySelectorAll("span[aria-hidden='true']");
      expect(separators.length).toBeGreaterThan(0);
      separators.forEach((separator) => {
        expect(separator).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("should have focus outline on buttons", () => {
      render(
        <Breadcrumb
          path={mockBreadcrumbPath}
          onNavigate={mockOnNavigate}
          currentFolderId="folder-3"
        />
      );

      const homeButton = screen.getByText("Home");
      expect(homeButton).toHaveClass("focus:outline-none", "focus:underline");
    });

    // ============================================
    // Props Update Tests
    // ============================================
    describe("Props Updates", () => {
      it("should update when path changes", () => {
        const newPath: BreadcrumbItem[] = [
          { id: "root", name: "Home" },
          { id: "folder-1", name: "Downloads" },
        ];

        const { rerender } = render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        expect(screen.getByText("Documents")).toBeInTheDocument();

        rerender(
          <Breadcrumb
            path={newPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-1"
          />
        );

        expect(screen.queryByText("Documents")).not.toBeInTheDocument();
        expect(screen.getByText("Downloads")).toBeInTheDocument();
      });

      it("should update when currentFolderId changes", () => {
        const { rerender } = render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-1"
          />
        );

        let currentItem = screen.getByText("Documents");
        expect(currentItem).toHaveAttribute("aria-current", "page");

        rerender(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        currentItem = screen.getByText("React");
        expect(currentItem).toHaveAttribute("aria-current", "page");

        const documentsButton = screen.getByText("Documents");
        expect(documentsButton.tagName).toBe("BUTTON");
      });

      it("should update when onNavigate callback changes", () => {
        const newOnNavigate = jest.fn();

        const { rerender } = render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        fireEvent.click(screen.getByText("Home"));
        expect(mockOnNavigate).toHaveBeenCalledTimes(1);

        rerender(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={newOnNavigate}
            currentFolderId="folder-3"
          />
        );

        fireEvent.click(screen.getByText("Home"));
        expect(newOnNavigate).toHaveBeenCalledTimes(1);
      });
    });

    // ============================================
    // Edge Cases Tests
    // ============================================
    describe("Edge Cases", () => {
      it("should handle very long folder names", () => {
        const longPath: BreadcrumbItem[] = [
          { id: "root", name: "Home" },
          {
            id: "folder-1",
            name: "A".repeat(100),
          },
        ];

        render(
          <Breadcrumb
            path={longPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-1"
          />
        );

        expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
      });

      it("should handle special characters in folder names", () => {
        const specialPath: BreadcrumbItem[] = [
          { id: "root", name: "Home" },
          { id: "folder-1", name: "Folder @#$%^&*()" },
          { id: "folder-2", name: "文件夹" },
        ];

        render(
          <Breadcrumb
            path={specialPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-2"
          />
        );

        expect(screen.getByText("Folder @#$%^&*()")).toBeInTheDocument();
        expect(screen.getByText("文件夹")).toBeInTheDocument();
      });

      it("should handle very deep nesting", () => {
        const deepPath: BreadcrumbItem[] = Array.from(
          { length: 20 },
          (_, i) => ({
            id: `folder-${i}`,
            name: `Level ${i}`,
          })
        );

        render(
          <Breadcrumb
            path={deepPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-19"
          />
        );

        expect(screen.getByText("Level 0")).toBeInTheDocument();
        expect(screen.getByText("Level 19")).toBeInTheDocument();
      });

      it("should handle currentFolderId not in path", () => {
        render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="non-existent-id"
          />
        );

        // All items should be clickable since currentFolderId is not found
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBe(mockBreadcrumbPath.length);
      });
    });

    // ============================================
    // Integration Tests
    // ============================================
    describe("Integration", () => {
      it("should handle full navigation workflow", () => {
        render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        // Click to go back
        fireEvent.click(screen.getByText("Documents"));
        expect(mockOnNavigate).toHaveBeenCalledWith("folder-1");

        // Click to go to root
        fireEvent.click(screen.getByText("Home"));
        expect(mockOnNavigate).toHaveBeenCalledWith("root");
      });

      it("should render correctly with memo optimization", () => {
        const { rerender } = render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        const firstRender = screen.getByText("React");
        expect(firstRender).toBeInTheDocument();

        // Same props should not trigger re-render due to memo
        rerender(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        const secondRender = screen.getByText("React");
        expect(secondRender).toBeInTheDocument();
      });
    });

    // ============================================
    // Snapshot Tests
    // ============================================
    describe("Snapshots", () => {
      it("should match snapshot with default props", () => {
        const { container } = render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
          />
        );

        expect(container).toMatchSnapshot();
      });

      it("should match snapshot with single item", () => {
        const singlePath: BreadcrumbItem[] = [{ id: "root", name: "Home" }];

        const { container } = render(
          <Breadcrumb
            path={singlePath}
            onNavigate={mockOnNavigate}
            currentFolderId="root"
          />
        );

        expect(container).toMatchSnapshot();
      });

      it("should match snapshot with custom styles", () => {
        const { container } = render(
          <Breadcrumb
            path={mockBreadcrumbPath}
            onNavigate={mockOnNavigate}
            currentFolderId="folder-3"
            breadcrumbStyles="bg-gray-100 p-4"
          />
        );

        expect(container).toMatchSnapshot();
      });
    });
  });
});
