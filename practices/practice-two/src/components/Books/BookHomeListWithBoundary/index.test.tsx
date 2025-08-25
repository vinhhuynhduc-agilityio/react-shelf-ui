import { render, screen } from "@testing-library/react";
import BookHomeListWithBoundary from "./index";
import { MOCK_BOOKS } from "@/__mocks__/book";

jest.mock("@/components", () => ({
  BookHomeList: ({ title }: { title: string }) => (
    <div data-testid="book-home-list">{title}</div>
  ),
  ErrorBoundary: jest.requireActual("@/components/ErrorBoundary").ErrorBoundary,
  ParagraphMessage: ({
    text,
    className,
  }: {
    text: string;
    className?: string;
  }) => (
    <div data-testid="paragraph-message" className={className}>
      {text}
    </div>
  ),
}));

describe("BookHomeListWithBoundary", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders BookHomeList with title and passes props", () => {
    render(
      <BookHomeListWithBoundary
        books={MOCK_BOOKS}
        title="My Books"
        isLoading={false}
        isError={false}
        skeletonCount={2}
      />
    );
    expect(screen.getByTestId("book-home-list")).toHaveTextContent("My Books");
  });

  it("renders fallback ParagraphMessage when error is thrown in BookHomeList", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    const OriginalBookHomeList =
      jest.requireActual("@/components").BookHomeList;
    (jest.requireMock("@/components").BookHomeList as unknown) = ThrowError;

    render(<BookHomeListWithBoundary books={MOCK_BOOKS} title="Favourites" />);

    expect(screen.getByTestId("paragraph-message")).toHaveTextContent(
      "Error loading favourites."
    );

    (jest.requireMock("@/components").BookHomeList as unknown) =
      OriginalBookHomeList;
  });
});
