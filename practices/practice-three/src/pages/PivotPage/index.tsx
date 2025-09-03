import { DraggableWindow } from "@/components";

const PivotPage = ({
  onClose,
  onMaximize,
  onMinimize,
}: {
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}) => {
  return (
    <DraggableWindow
      src="/images/pivot.png"
      title="Pivot"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
    >
      <h2>Pivot Content</h2>
    </DraggableWindow>
  );
};

export default PivotPage;
