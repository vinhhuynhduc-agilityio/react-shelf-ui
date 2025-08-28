interface DesktopIconProps {
  image: string;
  title: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ image, title }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full overflow-hidden box-border text-xs border-none drag-handle"
      style={{
        maxWidth: "100px",
        maxHeight: "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-auto"
        style={{ maxWidth: "60px", maxHeight: "60px" }}
      />
      <span className="mt-2 text-white font-bold text-sm">{title}</span>
    </div>
  );
};
