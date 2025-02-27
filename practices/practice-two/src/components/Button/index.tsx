import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'text' | 'disabledPrimary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit'
};

const Button: React.FC<ButtonProps> =
  ({
    children,
    variant = 'primary',
    onClick,
    disabled = false,
    className,
    type = 'button',
  }) => {
    const baseStyles = 'flex items-center justify-center focus:outline-none focus:ring-2 transition-all font-normal';
    const variants = {
      primary: 'bg-orange-500 text-white hover:bg-orange-600 lg:w-[201px] lg:h-[49px] md:w-[181px] md:h-[39px] w-[161px] h-[29px] rounded-[8px] lg:text-[18px] md:text-[16px] font-bold',
      outline: 'w-[70px] h-[25px] border border-[#F76B56] text-[#F76B56] text-[12px] rounded-[5px] hover:bg-orange-100 md:w-[85px] md:h-[30px] lg:w-[90px] lg:h-[35px]  md:text-[14px]',
      text: 'text-orange-500 hover:underline',
      disabledPrimary: 'bg-gray-400 text-white cursor-not-allowed hover:bg-gray-600 lg:w-[201px] lg:h-[49px] md:w-[181px] md:h-[39px] w-[161px] h-[29px] rounded-[8px] lg:text-[18px] md:text-[16px] font-bold',
    };

    return (
      <button
        className={clsx(
          baseStyles,
          variants[variant],
          className
        )}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  };

export default Button;
