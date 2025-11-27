import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface DropdownOption {
  label: string;
  key: string;
  icon: IconDefinition;
}

export interface DropdownProps {
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
