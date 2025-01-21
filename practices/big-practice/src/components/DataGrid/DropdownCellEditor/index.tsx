import {
  useEffect,
  useRef,
  useState
} from 'react'
import clsx from 'clsx';

// ag-grid
import { ICellEditorParams } from 'ag-grid-community';
import { Avatar } from '@/components';

export interface CustomCellEditorParams<T, D> extends ICellEditorParams {
  onSelectOption: (value: T, data: D) => void;
  options: T[];
  displayKey: keyof T;
  showAvatar?: boolean;
};

export const DropdownCellEditor = <T, D>(props: CustomCellEditorParams<T, D>) => {
  const {
    options,
    data,
    column,
    displayKey,
    showAvatar = false,
    eGridCell,
    stopEditing,
    onSelectOption,
  } = props;

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleSelect = (value: T) => {
    onSelectOption(value, data);
    stopEditing();
  };

  useEffect(() => {
    const cellElement = eGridCell as HTMLElement;
    const cellRect = cellElement.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.offsetHeight || 0;

    if (cellRect) {

      // Check the space below the cell
      const spaceBelow = window.innerHeight - cellRect.bottom;

      // If there is enough space below, display the dropdown below, otherwise display it above.
      const topPosition =
        spaceBelow > dropdownHeight
          ? cellRect.bottom
          : cellRect.top - dropdownHeight;

      setDropdownPosition({
        top: topPosition,
        left: cellRect.left,
      });
    }
  }, [eGridCell]);

  useEffect(() => {
    const handleAnyClickOrScrollOrResize = (event: Event) => {

      if (event.type === 'resize') {
        stopEditing();
        return;
      }

      // If click or scroll inside dropdown then do not stopEditing.
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }

      stopEditing();
    };

    // Add event listeners for click, scroll, and resize.
    document.addEventListener('click', handleAnyClickOrScrollOrResize);
    document.addEventListener('scroll', handleAnyClickOrScrollOrResize, true);
    window.addEventListener('resize', handleAnyClickOrScrollOrResize);

    // Cleanup event listeners when component unmounts.
    return () => {
      document.removeEventListener('click', handleAnyClickOrScrollOrResize);
      document.removeEventListener('scroll', handleAnyClickOrScrollOrResize, true);
      window.removeEventListener('resize', handleAnyClickOrScrollOrResize);
    };
  }, [stopEditing]);

  const currentValue = data[props.column.getColId()] as string;

  return (
    <div
      ref={dropdownRef}
      className="bg-white border border-gray-300 shadow-lg rounded z-1000 overflow-y-auto max-h-[314px]"
      style={{
        position: "fixed",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: column.getActualWidth(),
      }}
    >
      {options.map((option, index) => {
        const optionValue = String(option[displayKey]);
        const avatarUrl = (option as { avatarUrl?: string })['avatarUrl'];

        return (
          <div
            aria-label={optionValue}
            role="option"
            key={index}
            className={clsx(
              "flex items-center p-1.5 cursor-pointer border-b text-black border-gray-300 hover:bg-gray-200",
              optionValue === currentValue && "bg-blue-100"
            )}
            onClick={() => handleSelect(option)}
          >
            {showAvatar && avatarUrl && (
              <Avatar
                src={avatarUrl}
                alt={`Avatar for ${optionValue}`}
                size="small"
                ariaLabel={`Avatar for ${optionValue}`}
              />
            )}
            <div className="ml-3 truncate">{optionValue}</div>
          </div>
        );
      })}
    </div>
  );
};
