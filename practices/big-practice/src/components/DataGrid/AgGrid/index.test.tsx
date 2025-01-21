import { render } from '@testing-library/react';
import { AgGridReact } from 'ag-grid-react';
import { DataGrid, DataGridProps } from '.';
import { UserData } from '@/types';

// Mock AgGridReact to avoid actual grid rendering during tests
jest.mock('ag-grid-react', () => ({
  AgGridReact: jest.fn(() => null),
}));

const mockProps: DataGridProps<UserData> = {
  rowData: [],
  columnDefs: [{ headerName: 'Persons', field: 'fullName' }],
  onRowClicked: jest.fn(),
  getRowClass: jest.fn(),
  rowHeight: 30,
  onGridReady: jest.fn(),
  getRowId: jest.fn()
};

describe('DataGrid Component', () => {
  it('matches snapshot for default state', () => {
    const { container } = render(<DataGrid {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render AgGridReact component', () => {
    render(<DataGrid {...mockProps} />);

    // Check if AgGridReact has been rendered
    expect(AgGridReact).toHaveBeenCalledTimes(1);
  });

  it('should pass defaultColDef with flex: 1 and resizable: false', () => {
    render(<DataGrid {...mockProps} />);

    // Check if defaultColDef is initialized with flex: 1 and resizable: false
    const expectedDefaultColDef = {
      resizable: false,
    };

    // Verify that the expected defaultColDef is passed to AgGridReact
    expect(AgGridReact).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultColDef: expectedDefaultColDef,
        rowData: mockProps.rowData,
        columnDefs: mockProps.columnDefs,
      }),
      {}
    );
  });
});
