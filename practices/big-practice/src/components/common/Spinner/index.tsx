interface SpinnerProps {
  borderColor?: 'primary' | 'secondary';
};

export const Spinner: React.FC<SpinnerProps> = ({
  borderColor = 'primary',
}) => {
  const spinnerBorderClass =
    borderColor === 'primary'
      ? 'border-t-blue-500'
      : 'border-t-red-500';

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`w-12 h-12 border-4 border-gray-300 ${spinnerBorderClass} rounded-full animate-spin`}
      ></div>
    </div>
  );
};
