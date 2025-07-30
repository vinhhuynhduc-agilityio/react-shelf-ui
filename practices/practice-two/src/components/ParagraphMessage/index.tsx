interface ParagraphMessageProps {
  text: string;
  className?: string;
}

export const ParagraphMessage: React.FC<ParagraphMessageProps> = ({
  text,
  className = "",
}) => {
  return <p className={className}>{text}</p>;
};
