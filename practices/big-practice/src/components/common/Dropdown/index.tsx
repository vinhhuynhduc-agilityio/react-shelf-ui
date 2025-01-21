import {
  useState,
  useRef,
  useEffect,
  forwardRef
} from 'react';
import clsx from 'clsx';

interface OptionData {
  id: string;
  value: string;
};

interface DropdownProps {
  options: OptionData[];
  placeholder: string;
  onSelect: (option: OptionData) => void;
};

export const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  ({
    options,
    placeholder,
    onSelect
  },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<OptionData | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleSelect = (option: OptionData) => {
      setSelectedOption(option);
      onSelect(option);
      setIsOpen(false);
    };

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const handleDropdownClose = (event: Event) => {
      if (event.type === 'resize') {
        setIsOpen(false);
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      // Event listener for mouse click outside
      document.addEventListener('mousedown', handleDropdownClose);

      // Event listener for window resize
      window.addEventListener('resize', handleDropdownClose);

      // Cleanup
      return () => {
        document.removeEventListener('mousedown', handleDropdownClose);
        window.removeEventListener('resize', handleDropdownClose);
      };
    }, []);

    const valueDropdown = selectedOption
      ? selectedOption.value.toString()
      : '';

    return (
      <div
        className="relative w-full"
        ref={dropdownRef}
      >
        <div
          className="flex items-center border border-gray-300 rounded-md p-2 cursor-text bg-white"
          onClick={toggleDropdown}
        >
          <input
            ref={ref}
            type="text"
            placeholder={placeholder}
            className="flex-1 outline-none bg-transparent text-gray-700 cursor-text"
            readOnly
            value={valueDropdown}
          />
          <span className="ml-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-gray-500 border-l-transparent border-r-transparent cursor-pointer"></span>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 max-h-[297px] bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto z-10">
            {options.map((option) => (
              <div
                key={option.id}
                role="option"
                className={clsx(
                  "p-1.5 cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-blue-500 border-b border-gray-300 last:border-0",
                  selectedOption?.id === option.id && "bg-blue-100"
                )}
                onClick={() => handleSelect(option)}
              >
                {option.value}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
