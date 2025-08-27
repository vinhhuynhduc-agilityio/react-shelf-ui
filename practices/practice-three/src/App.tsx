import { useState } from "react";
import GridLayout from "react-grid-layout";
import { DesktopIcon } from "./component/common";

const App = () => {
  const [layout, setLayout] = useState([
    { i: "spreadsheetIcon", x: 0, y: 0, w: 1, h: 1 },
    { i: "fileManagerIcon", x: 1, y: 0, w: 1, h: 1 },
    { i: "pivotIcon", x: 2, y: 0, w: 1, h: 1 },
    { i: "kanbanIcon", x: 3, y: 0, w: 1, h: 1 },
  ]);

  return (
    <div
      className="w-screen min-h-screen p-2 relative"
      style={{
        backgroundImage: `url('/images/dark-blue-mountain.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <GridLayout
        className="layout"
        layout={layout}
        rowHeight={110}
        width={window.innerWidth}
        isDraggable={true}
        isResizable={false}
        margin={[10, 10]}
        containerPadding={[20, 20]}
        onLayoutChange={setLayout}
        compactType={null}
        allowOverlap={false}
        preventCollision={true}
        draggableHandle=".drag-handle"
      >
        <DesktopIcon
          id="spreadsheetIcon"
          key="spreadsheetIcon"
          image="images/spreadsheet.png"
          title="Spreadsheet"
        />
        <DesktopIcon
          id="filemanagerIcon"
          key="filemanagerIcon"
          image="images/filemanager.png"
          title="Filemanager"
        />
        <DesktopIcon
          id="pivotIcon"
          key="pivotIcon"
          image="images/pivot.png"
          title="Pivot"
        />
        <DesktopIcon
          id="kanbanIcon"
          key="kanbanIcon"
          image="images/kanban.png"
          title="Kanban"
        />
      </GridLayout>
    </div>
  );
};

export default App;
