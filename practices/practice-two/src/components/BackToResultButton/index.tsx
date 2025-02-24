interface BackToResultButtonProps {
  onClick: () => void;
  title: string
};

const BackToResultButton: React.FC<BackToResultButtonProps> = ({
  onClick,
  title
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-gray-600 hover:text-gray-800 transition-all mb-4"
    >
      <svg className="mr-2.5" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.25 7L0.75 7M0.75 7L6.375 12.625M0.75 7L6.375 1.375" stroke="#4D4D4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {title}
    </button>
  );
};

export default BackToResultButton;
