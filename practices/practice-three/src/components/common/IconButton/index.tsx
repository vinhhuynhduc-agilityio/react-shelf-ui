interface IconButtonProps {
  // Use onMouseDown instead of onClick in contexts where react-grid-layout is used,
  // due to known issues with event capturing in react-grid-layout that may prevent onClick from firing.
  // In other places without react-grid-layout, onClick can still be used normally.
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  buttonStyles?: string;
  iconStyles?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const IconButton = ({
  onClick,
  onMouseDown,
  buttonStyles = "p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full",
  iconStyles = "",
  ariaLabel = "",
  disabled = false,
}: IconButtonProps) => {
  return (
    <button
      className={`text-lg cursor-pointer ${buttonStyles}`}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (onMouseDown) {
          onMouseDown(e);
        }
      }}
      aria-label={ariaLabel}
    >
      <i className={`${iconStyles}`}></i>
    </button>
  );
};

export default IconButton;
