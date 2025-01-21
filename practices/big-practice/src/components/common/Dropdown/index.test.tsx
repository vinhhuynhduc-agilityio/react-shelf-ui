import {
  render,
  fireEvent,
  screen
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dropdown } from '.';

describe("Dropdown Component", () => {

  // Mock data for dropdown options
  const options = [
    { id: "1", value: "Option 1" },
    { id: "2", value: "Option 2" },
    { id: "3", value: "Option 3" },
  ];

  const placeholder = "Select an option";
  const onSelectMock = jest.fn();

  let inputElement: HTMLInputElement;

  // Shared setup before each test
  beforeEach(() => {
    render(
      <Dropdown
        options={options}
        placeholder={placeholder}
        onSelect={onSelectMock}
      />
    );

    inputElement = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    fireEvent.click(inputElement);
  });

  it('matches snapshot for default state', () => {
    const { container } = render(
      <Dropdown
        options={options}
        placeholder={placeholder}
        onSelect={onSelectMock}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders the dropdown with placeholder", () => {
    expect(inputElement).toBeInTheDocument();
  });

  it("opens the dropdown when the input field is clicked", () => {
    options.forEach((option) => {
      expect(screen.getByText(option.value)).toBeInTheDocument();
    });
  });

  it("closes the dropdown when an option is selected", () => {
    const optionToSelect = screen.getByText("Option 2");
    fireEvent.click(optionToSelect);

    // Verify the dropdown is closed
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();

    // Verify onSelect callback is called with the correct option
    expect(onSelectMock).toHaveBeenCalledWith({ id: "2", value: "Option 2" });
  });

  it("displays the selected option in the input field", () => {
    const optionToSelect = screen.getByText("Option 1");
    fireEvent.click(optionToSelect);

    // Verify the selected option is displayed in the input field
    expect(inputElement).toHaveValue("Option 1");
  });

  it("closes the dropdown when clicking outside", () => {
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);

    // Verify the dropdown is closed
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("closes the dropdown when the window is resized", () => {
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // Simulate a window resize event
    fireEvent(window, new Event("resize"));

    // Verify the dropdown is closed
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });
});
