import { useMemo } from 'react';

// ag-grid
import { AgGridReact } from 'ag-grid-react';
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ColDef,
  GetRowIdParams,
  GridOptions,
  GridReadyEvent,
  RowClassParams,
  RowClickedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';

export interface DataGridProps<T> {
  rowData: T[];
  userData?: T[];
  columnDefs: ColDef<T>[];
  onRowClicked?: (event: RowClickedEvent) => void;
  getRowClass?: (params: RowClassParams) => string;
  rowHeight?: number;
  onGridReady: (event: GridReadyEvent) => void;
  getRowId: (params: GetRowIdParams<T>) => string;
  onCellEditingStarted?: (event: CellEditingStartedEvent) => void;
  onCellEditingStopped?: (event: CellEditingStoppedEvent) => void;
  tooltipShowDelay?: number;
  enableBrowserTooltips?: boolean;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  loading?: boolean;
  loadingOverlayComponent?: React.ComponentType;
  suppressClickEdit?: boolean;
};

export const DataGrid = <T,>(props: DataGridProps<T>) => {
  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
    };
  }, []);

  const buildGridProps = (): GridOptions => {

    return {
      defaultColDef,
      ...props
    };
  };

  const gridProps = buildGridProps();

  return (
    <AgGridReact
      {...gridProps}
    />
  );
};
