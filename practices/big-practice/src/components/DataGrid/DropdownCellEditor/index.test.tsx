import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Column } from 'ag-grid-community';
import { DropdownCellEditor, CustomCellEditorParams } from '.';

const mockStopEditing = jest.fn();
const mockOnSelectOption = jest.fn();
const mockColumn: Partial<Column> = {
  getColId: () => 'projectName',
  getActualWidth: () => 200,
};

const mockData = {
  "id": "71e564f4-7c18-47f7-89f2-abe4b7ec2854",
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "projectId": "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
  "taskName": "Build Front12",
  "startDate": "10 Aug 24",
  "completedDate": "28 Nov 24",
  "currency": 2000,
  "status": true,
  "projectName": "Failure Testing",
  "fullName": "Jane Smith"
};
const mockOptions = [
  {
    "id": "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
    "projectName": "Support"
  },
  {
    "id": "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
    "projectName": "Failure Testing"
  },
  {
    "id": "e38e56a2-4d3c-469d-8345-45d6b5fae9f9",
    "projectName": "Quality Management"
  },
  {
    "id": "f49b68f4-5e5b-457d-bf16-1b5b78e6f5f1",
    "projectName": "Data Quality"
  },
  {
    "id": "47c80c97-6575-45eb-a25b-75ee485bf9fb",
    "projectName": "Test"
  }
];

const defaultProps: Partial<CustomCellEditorParams<typeof mockOptions[0], typeof mockData>> = {
  options: mockOptions,
  data: mockData,
  column: mockColumn as Column,
  displayKey: 'projectName',
  eGridCell: document.createElement('div'),
  stopEditing: mockStopEditing,
  onSelectOption: mockOnSelectOption,
};

describe('DropdownCellEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot for default state', () => {
    const { container } = render(
      <DropdownCellEditor
        {...defaultProps as CustomCellEditorParams<typeof mockOptions[0], typeof mockData>}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders options correctly', () => {
    render(
      <DropdownCellEditor
        {...defaultProps as CustomCellEditorParams<typeof mockOptions[0], typeof mockData>}
      />
    );

    mockOptions.forEach(option => {
      expect(screen.getByText(option.projectName)).toBeInTheDocument();
    });
  });

  it('handles option selection', () => {
    render(
      <DropdownCellEditor
        {...defaultProps as CustomCellEditorParams<typeof mockOptions[0], typeof mockData>}
      />
    );

    fireEvent.click(screen.getByText(mockOptions[1].projectName));
    expect(mockOnSelectOption).toHaveBeenCalledWith(mockOptions[1], mockData);
    expect(mockStopEditing).toHaveBeenCalled();
  });

  it('closes on outside click', () => {
    render(
      <DropdownCellEditor
        {...defaultProps as CustomCellEditorParams<typeof mockOptions[0], typeof mockData>}
      />
    );

    fireEvent.mouseDown(document.body);
    setTimeout(() => { expect(mockStopEditing).toHaveBeenCalled(); }, 100);
  });

  it('closes on resize', () => {
    render(
      <DropdownCellEditor
        {...defaultProps as CustomCellEditorParams<typeof mockOptions[0], typeof mockData>}
      />
    );

    fireEvent(window, new Event('resize'));
    expect(mockStopEditing).toHaveBeenCalled();
  });
});
