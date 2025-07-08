import { render, screen } from "@testing-library/react";
import RatingStars from ".";

describe("RatingStars", () => {
it("renders all full stars for integer rating", () => {
  render(<RatingStars rating={5} />);
  expect(screen.getAllByTestId("icon-full-star")).toHaveLength(5);
  expect(screen.queryByTestId("icon-half-star")).toBeNull();
  expect(screen.queryByTestId("icon-empty-star")).toBeNull();
});

it("renders correct full, half, and empty stars for decimal rating", () => {
  render(<RatingStars rating={3.5} />);
  expect(screen.getAllByTestId("icon-full-star")).toHaveLength(3);
  expect(screen.getAllByTestId("icon-half-star")).toHaveLength(1);
  expect(screen.getAllByTestId("icon-empty-star")).toHaveLength(1);
});

it("renders all empty stars for zero rating", () => {
  render(<RatingStars rating={0} />);
  expect(screen.queryByTestId("icon-full-star")).toBeNull();
  expect(screen.queryByTestId("icon-half-star")).toBeNull();
  expect(screen.getAllByTestId("icon-empty-star")).toHaveLength(5);
});

it("respects maxStars prop", () => {
  render(<RatingStars rating={2.5} maxStars={10} />);
  expect(screen.getAllByTestId("icon-full-star")).toHaveLength(2);
  expect(screen.getAllByTestId("icon-half-star")).toHaveLength(1);
  expect(screen.getAllByTestId("icon-empty-star")).toHaveLength(7);
});

it("matches snapshot for default (5 stars)", () => {
  const { container } = render(<RatingStars rating={4.5} />);
  expect(container).toMatchSnapshot();
});

it("matches snapshot for custom maxStars", () => {
  const { container } = render(<RatingStars rating={3.5} maxStars={7} />);
  expect(container).toMatchSnapshot();
});
});
