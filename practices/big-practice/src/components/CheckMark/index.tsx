import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";

export interface IconRendererProps {
  onStatusValueChange: () => void;
  value: boolean;
  isDisabled?: boolean;
}

export const CheckMark: React.FC<IconRendererProps> = (props) => {
  const [isComplete, setIsComplete] = useState<boolean>(props.value);
  const { isDisabled, onStatusValueChange } = props;

  // Update icon state when props.value changes
  useEffect(() => {
    setIsComplete(props.value);
  }, [props.value]);

  // Define classes dynamically based on `isDisabled`
  const containerClass = `flex justify-center items-center w-full h-full ${isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
    }`;

  return (
    <span
      data-testid="status-icon"
      className={containerClass}
      onClick={!isDisabled ? onStatusValueChange : undefined}
      aria-label="icon"
    >
      {isComplete ? (
        <FaCheckCircle data-testid="icon-check" color="#1CA1C1" size={20} />
      ) : (
        <FaClock data-testid="icon-clock" color="#FF5C4C" size={20} />
      )}
    </span>
  );
};
