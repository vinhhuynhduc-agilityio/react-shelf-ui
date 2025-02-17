import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'text';
  onClick?: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className }) => {
  const baseStyles = 'flex items-center justify-center focus:outline-none focus:ring-2 transition-all font-normal';
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    outline: 'w-[70px] h-[25px] border border-[#F76B56] text-[#F76B56] text-[12px] rounded-[5px] hover:bg-orange-100 md:w-[85px] md:h-[30px] lg:text-[14px]',
    text: 'text-orange-500 hover:underline',
  };

  return (
    <button className={clsx(baseStyles, variants[variant], className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
