import { memo } from "react";
import clsx from "clsx";

type BadgeProps = {
  label: string;
  className?: string;
};

const Badge: React.FC<BadgeProps> = memo(({ label, className }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-[5px] text-sm font-normal",
        "lg:w-[85px] lg:h-[26px] lg:text-sm",
        "w-[70px] h-[22px] text-[12px]",
        className
      )}
    >
      {label}
    </span>
  );
});

export default Badge;
