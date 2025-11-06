import clsx from "clsx";
import { useEffect } from "react";

interface StatusBarProps {
  message: string | null;
  type: "success" | "error";
  onClear: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ message, type, onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClear, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      className={clsx(
        "h-8 px-4 flex items-center text-sm font-medium border-t border-[#DADEE0]",
        type === "success"
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      )}
    >
      <i
        className={clsx(
          "fa-solid mr-2",
          type === "success" ? "fa-check" : "fa-exclamation-triangle"
        )}
      ></i>
      {message}
    </div>
  );
};

export default StatusBar;
