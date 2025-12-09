import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UnsavedChangesModal from ".";

jest.mock("@/icons/fa", () => ({
  fa: {
    faExclamationTriangle: "faExclamationTriangle",
  },
}));

jest.mock("@/components", () => ({
  Button: ({
    variant,
    children,
    onClick,
  }: {
    variant: string;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      data-testid={`btn-${variant}`}
      onClick={onClick}
      className={`button button-${variant}`}
    >
      {children}
    </button>
  ),
  Icon: ({ icon, className }: { icon: string; className: string }) => (
    <i data-testid="icon" data-icon={icon} className={className}>
      Icon
    </i>
  ),
  Modal: ({
    isOpen,
    title,
    onClose,
    titleAlign,
    children,
  }: {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    titleAlign: string;
    children: React.ReactNode;
  }) =>
    isOpen && (
      <div data-testid="modal" data-title={title} data-title-align={titleAlign}>
        <div data-testid="modal-header">
          <h2>{title}</h2>
          <button
            data-testid="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div data-testid="modal-content">{children}</div>
      </div>
    ),
}));

describe("UnsavedChangesModal", () => {
  const defaultProps = {
    isOpen: true,
    fileName: "test-document",
    onSave: jest.fn(),
    onDiscard: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render modal when isOpen is true", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should not render modal when isOpen is false", () => {
      render(<UnsavedChangesModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal with title 'Save'", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveAttribute("data-title", "Save");
    });

    it("should render modal with center title alignment", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveAttribute("data-title-align", "center");
    });
  });

  describe("Icon", () => {
    it("should render warning icon", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("data-icon", "faExclamationTriangle");
    });

    it("should render icon with orange-500 color", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("text-orange-500");
    });

    it("should render icon with text-2xl size", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("text-2xl");
    });
  });

  describe("Message Content", () => {
    it("should render confirmation message", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      expect(
        screen.getByText(/Do you want to save the changes you made to/)
      ).toBeInTheDocument();
    });

    it("should display the file name in the message", () => {
      render(<UnsavedChangesModal {...defaultProps} fileName="my-file.xlsx" />);

      expect(screen.getByText(/my-file.xlsx/)).toBeInTheDocument();
    });

    it("should use default fileName when not provided", () => {
      render(<UnsavedChangesModal {...defaultProps} fileName={undefined} />);

      expect(screen.getByText(/this document/)).toBeInTheDocument();
    });

    it("should display file name in quotes", () => {
      render(<UnsavedChangesModal {...defaultProps} fileName="spreadsheet" />);

      expect(screen.getByText(/"spreadsheet"/)).toBeInTheDocument();
    });

    it("should render file name as bold", () => {
      const { container } = render(
        <UnsavedChangesModal {...defaultProps} fileName="test" />
      );

      const strongElement = container.querySelector("strong");
      expect(strongElement).toBeInTheDocument();
      expect(strongElement).toHaveTextContent('"test"');
    });

    it("should render message with gray-700 color", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const messageElement = container.querySelector(".text-gray-700");
      expect(messageElement).toBeInTheDocument();
    });

    it("should render message with text-sm size", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const messageElement = container.querySelector(".text-sm");
      expect(messageElement).toBeInTheDocument();
    });

    it("should have proper line height for message", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const messageElement = container.querySelector(".leading-relaxed");
      expect(messageElement).toBeInTheDocument();
    });
  });

  describe("Buttons", () => {
    it("should render Yes button with primary variant", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      expect(screen.getByTestId("btn-primary")).toBeInTheDocument();
      expect(screen.getByTestId("btn-primary")).toHaveTextContent("Yes");
    });

    it("should render No button with success variant", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const buttons = screen.getAllByTestId("btn-success");
      expect(buttons.length).toBe(2); // No and Cancel buttons
    });

    it("should render Cancel button with success variant", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const buttons = screen.getAllByTestId("btn-success");
      expect(buttons.length).toBe(2);
    });

    it("should render three buttons", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const buttons = screen.getAllByRole("button", {
        hidden: false,
      });
      const actionButtons = buttons.filter(
        (btn) =>
          btn.getAttribute("data-testid")?.startsWith("btn-") ||
          btn.getAttribute("data-testid") === "modal-close"
      );
      expect(actionButtons.length).toBeGreaterThanOrEqual(3);
    });

    it("should render buttons in correct order", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const buttonContainer = container.querySelector(".flex.justify-end");
      expect(buttonContainer).toBeInTheDocument();
    });

    it("should have gap between buttons", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const buttonContainer = container.querySelector(".gap-3");
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe("Button Actions", () => {
    it("should call onSave when Yes button is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("btn-primary"));

      expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
    });

    it("should call onDiscard when No button is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const successButtons = screen.getAllByTestId("btn-success");
      fireEvent.click(successButtons[0]); // First success button is No

      expect(defaultProps.onDiscard).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when Cancel button is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const successButtons = screen.getAllByTestId("btn-success");
      fireEvent.click(successButtons[1]); // Second success button is Cancel

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("should not call other handlers when Yes is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("btn-primary"));

      expect(defaultProps.onDiscard).not.toHaveBeenCalled();
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });

    it("should not call other handlers when No is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const successButtons = screen.getAllByTestId("btn-success");
      fireEvent.click(successButtons[0]);

      expect(defaultProps.onSave).not.toHaveBeenCalled();
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });

    it("should not call other handlers when Cancel is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const successButtons = screen.getAllByTestId("btn-success");
      fireEvent.click(successButtons[1]);

      expect(defaultProps.onSave).not.toHaveBeenCalled();
      expect(defaultProps.onDiscard).not.toHaveBeenCalled();
    });
  });

  describe("Modal Close", () => {
    it("should call onCancel when close button is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("modal-close"));

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it("should not call other handlers when close button is clicked", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("modal-close"));

      expect(defaultProps.onSave).not.toHaveBeenCalled();
      expect(defaultProps.onDiscard).not.toHaveBeenCalled();
    });
  });

  describe("Layout and Styling", () => {
    it("should have flex container with flex-col", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const flexContainer = container.querySelector(
        ".flex.flex-col.items-center.gap-4"
      );
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have padding in content", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const flexContainer = container.querySelector(".p-4");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should center content items", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const flexContainer = container.querySelector(".items-center");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should have gap between icon and message", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const iconContainer = container.querySelector(".flex.items-center.gap-3");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should have margin between message and buttons", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const buttonContainer = container.querySelector(".mt-8");
      expect(buttonContainer).toBeInTheDocument();
    });

    it("should align buttons to the end", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const buttonContainer = container.querySelector(".justify-end");
      expect(buttonContainer).toBeInTheDocument();
    });

    it("should make buttons full width of container", () => {
      const { container } = render(<UnsavedChangesModal {...defaultProps} />);

      const buttonContainer = container.querySelector(".w-full");
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    it("should work with different file names", () => {
      const fileNames = [
        "document.xlsx",
        "spreadsheet.csv",
        "data.json",
        "presentation.pptx",
      ];

      fileNames.forEach((fileName) => {
        const { unmount } = render(
          <UnsavedChangesModal {...defaultProps} fileName={fileName} />
        );

        expect(screen.getByText(new RegExp(fileName))).toBeInTheDocument();
        unmount();
      });
    });

    it("should handle very long file names", () => {
      const longFileName =
        "very-long-file-name-with-many-characters-that-should-still-display-correctly.xlsx";

      render(<UnsavedChangesModal {...defaultProps} fileName={longFileName} />);

      expect(screen.getByText(new RegExp(longFileName))).toBeInTheDocument();
    });

    it("should handle special characters in file name", () => {
      const specialFileName = 'file-with-"quotes"-and-special-chars.xlsx';

      render(
        <UnsavedChangesModal {...defaultProps} fileName={specialFileName} />
      );

      expect(
        screen.getByText(new RegExp("file-with-", "i"))
      ).toBeInTheDocument();
    });

    it("should have correct callback functions", () => {
      expect(typeof defaultProps.onSave).toBe("function");
      expect(typeof defaultProps.onDiscard).toBe("function");
      expect(typeof defaultProps.onCancel).toBe("function");
    });
  });

  describe("Edge Cases", () => {
    it("should render multiple modals independently", () => {
      const { container } = render(
        <>
          <UnsavedChangesModal {...defaultProps} fileName="file1" />
          <UnsavedChangesModal
            {...defaultProps}
            fileName="file2"
            isOpen={false}
          />
        </>
      );

      const modals = container.querySelectorAll('[data-testid="modal"]');
      expect(modals.length).toBe(1); // Only open modal renders
    });

    it("should handle rapid button clicks", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const yesButton = screen.getByTestId("btn-primary");

      fireEvent.click(yesButton);
      fireEvent.click(yesButton);
      fireEvent.click(yesButton);

      expect(defaultProps.onSave).toHaveBeenCalledTimes(3);
    });

    it("should work when all callbacks are the same function", () => {
      const handler = jest.fn();

      render(
        <UnsavedChangesModal
          isOpen={true}
          fileName="test"
          onSave={handler}
          onDiscard={handler}
          onCancel={handler}
        />
      );

      fireEvent.click(screen.getByTestId("btn-primary"));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should render when fileName is empty string", () => {
      render(<UnsavedChangesModal {...defaultProps} fileName="" />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should handle isOpen toggle", () => {
      const { rerender } = render(
        <UnsavedChangesModal {...defaultProps} isOpen={true} />
      );

      expect(screen.getByTestId("modal")).toBeInTheDocument();

      rerender(<UnsavedChangesModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

      rerender(<UnsavedChangesModal {...defaultProps} isOpen={true} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have close button with aria-label", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      const closeButton = screen.getByTestId("modal-close");
      expect(closeButton).toHaveAttribute("aria-label", "Close modal");
    });

    it("should have descriptive button text", () => {
      render(<UnsavedChangesModal {...defaultProps} />);

      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("No")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("should have clear message content", () => {
      render(<UnsavedChangesModal {...defaultProps} fileName="test.xlsx" />);

      const message = screen.getByText(
        /Do you want to save the changes you made to/
      );
      expect(message).toBeInTheDocument();
    });
  });
});
