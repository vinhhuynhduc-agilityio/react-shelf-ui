import { useState } from "react";
import GridLayout from "react-grid-layout";

// Components
import { DesktopIcon } from "./component";

// Constant
import { DESKTOP_ICONS } from "./constant";

const App = () => {
  const [layout, setLayout] = useState([
    { i: "spreadsheetIcon", x: 0, y: 0, w: 1, h: 1 },
    { i: "fileManagerIcon", x: 0, y: 1, w: 1, h: 1 },
    { i: "pivotIcon", x: 0, y: 2, w: 1, h: 1 },
    { i: "kanbanIcon", x: 0, y: 3, w: 1, h: 1 },
  ]);

  const rowHeight = 120;
  const maxRows = Math.floor(window.innerHeight / rowHeight);
  const cols = Math.floor(window.innerWidth / 120);

  return (
    <div
      className="w-screen min-h-screen p-2 relative"
      style={{
        backgroundImage: `url('/images/background-desktop.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <GridLayout
        className="layout"
        layout={layout}
        rowHeight={rowHeight}
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
        verticalCompact={true}
        maxRows={maxRows}
        cols={cols}
      >
        {DESKTOP_ICONS.map((icon) => (
          <div key={icon.key}>
            <DesktopIcon image={icon.image} title={icon.title} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default App;
