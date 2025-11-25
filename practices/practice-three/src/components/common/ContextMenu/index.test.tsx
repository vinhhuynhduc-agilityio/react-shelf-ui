import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContextMenu from ".";
import type { ContextMenuOption } from "@/types";

describe("ContextMenu", () => {
  const mockOptions: ContextMenuOption[] = [
    {
      label: "Edit",
      icon: "fa-solid fa-pen",
      onClick: jest.fn(),
      danger: false,
    },
    {
      label: "Delete",
      icon: "fa-solid fa-trash",
      onClick: jest.fn(),
      danger: true,
    },
    {
      label: "Download",
      icon: "fa-solid fa-download",
      onClick: jest.fn(),
      danger: false,
    },
  ];

  const defaultProps = {
    visible: true,
    x: 100,
    y: 150,
    options: mockOptions,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when visible is false", () => {
    render(<ContextMenu {...defaultProps} visible={false} />);

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("should render menu with all options when visible is true", () => {
    render(<ContextMenu {...defaultProps} />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("should call onClick and onClose when menu item clicked", () => {
    render(<ContextMenu {...defaultProps} />);

    fireEvent.click(screen.getByText("Edit"));

    expect(mockOptions[0].onClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should close menu when clicked outside", async () => {
    render(<ContextMenu {...defaultProps} />);

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("should not close menu when clicked on menu itself", () => {
    const { container } = render(<ContextMenu {...defaultProps} />);

    const menu = container.querySelector("ul");
    if (menu) {
      fireEvent.mouseDown(menu);
    }

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("should apply danger style to delete option", () => {
    render(<ContextMenu {...defaultProps} />);

    const deleteItem = screen.getByText("Delete").closest("li");
    expect(deleteItem).toHaveClass("text-red-600");
  });

  it("should apply normal style to non-danger options", () => {
    render(<ContextMenu {...defaultProps} />);

    const editItem = screen.getByText("Edit").closest("li");
    expect(editItem).toHaveClass("text-[#475466]");
    expect(editItem).not.toHaveClass("text-red-600");
  });

  it("should render icons for all options", () => {
    render(<ContextMenu {...defaultProps} />);

    const icons = document.querySelectorAll("i");
    expect(icons).toHaveLength(3);
    expect(icons[0]).toHaveClass("fa-solid", "fa-pen");
    expect(icons[1]).toHaveClass("fa-solid", "fa-trash");
    expect(icons[2]).toHaveClass("fa-solid", "fa-download");
  });

  it("should close menu on scroll event", async () => {
    render(<ContextMenu {...defaultProps} />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("should close menu on window resize event", async () => {
    render(<ContextMenu {...defaultProps} />);

    fireEvent.resize(window);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("should remove event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
    const windowRemoveEventListenerSpy = jest.spyOn(
      window,
      "removeEventListener"
    );

    const { unmount } = render(<ContextMenu {...defaultProps} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      true
    );
    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
    windowRemoveEventListenerSpy.mockRestore();
  });

  it("should not setup event listeners when visible is false", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");

    render(<ContextMenu {...defaultProps} visible={false} />);

    expect(addEventListenerSpy).not.toHaveBeenCalled();

    addEventListenerSpy.mockRestore();
  });

  it("should handle multiple options without danger flag", () => {
    const options: ContextMenuOption[] = [
      {
        label: "Option 1",
        icon: "fa-solid fa-check",
        onClick: jest.fn(),
        danger: false,
      },
      {
        label: "Option 2",
        icon: "fa-solid fa-times",
        onClick: jest.fn(),
        danger: false,
      },
    ];

    render(<ContextMenu {...defaultProps} options={options} />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 1").closest("li")).not.toHaveClass(
      "text-red-600"
    );
  });

  it("should render in document.body using createPortal", () => {
    render(<ContextMenu {...defaultProps} />);

    const menu = document.body.querySelector("ul");
    expect(menu).toBeInTheDocument();
    expect(menu?.querySelector("li")).toBeInTheDocument();
  });
});
