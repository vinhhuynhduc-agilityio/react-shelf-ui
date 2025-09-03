import { DraggableWindow } from "@/components";

const SpreadsheetPage = ({
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
      src="/images/spreadsheet.png"
      title="Spreadsheet"
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
    >
      <h2>Spreadsheet Content</h2>
    </DraggableWindow>
  );
};

export default SpreadsheetPage;
