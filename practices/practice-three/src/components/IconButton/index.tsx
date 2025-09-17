interface IconButtonProps {
  icon: string;
  onClick: () => void;
  buttonStyles?: string;
  iconStyles?: string;
}

const IconButton = ({
  icon,
  onClick,
  buttonStyles = "p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full",
  iconStyles = "",
}: IconButtonProps) => {
  return (
    <button
      className={`text-lg cursor-pointer ${buttonStyles}`}
      onClick={onClick}
    >
      <i
        className={`${icon} text-[#94A1B3] hover:bg-gray-100 ${iconStyles}`}
      ></i>
    </button>
  );
};

export default IconButton;
