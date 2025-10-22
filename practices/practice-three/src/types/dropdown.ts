export interface DropdownOption {
  label: string;
  key: string;
  icon?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
