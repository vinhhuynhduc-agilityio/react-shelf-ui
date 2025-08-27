interface DesktopIconProps {
  id: string;
  key: string;
  image: string;
  title: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  key,
  image,
  title,
}) => {
  return (
    <div
      key={key}
      id={id}
      className="flex flex-col items-center justify-center w-24 h-28 min-w-24 min-h-28 overflow-hidden box-border text-xs border-none drag-handle"
    >
      <img src={image} alt={title} className="w-12 h-12" />
      <span className="mt-2 text-white font-bold text-sm">{title}</span>
    </div>
  );
};
