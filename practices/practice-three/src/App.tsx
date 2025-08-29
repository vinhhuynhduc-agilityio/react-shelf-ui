import { useState } from "react";
import GridLayout from "react-grid-layout";
import { Rnd } from "react-rnd";

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
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const initialX = (window.innerWidth - 800) / 2;
  const initialY = (window.innerHeight - 450) / 2;

  const rowHeight = 120;
  const maxRows = Math.floor(window.innerHeight / rowHeight);
  const cols = Math.floor(window.innerWidth / 120);

  const handleIconClick = (keyIcon: string) => {
    setSelectedIcon(keyIcon);
  };

  const renderSpreadSheet = () => {
    return (
      <Rnd
        default={{
          x: initialX,
          y: initialY,
          width: 800,
          height: 450,
        }}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        dragHandleClassName="drag-handle"
        style={{
          position: "absolute",
          zIndex: 9999,
        }}
      >
        <div className="bg-white shadow-lg overflow-hidden text-[#475466] w-full h-full">
          {/* Header with buttons */}
          <div className="drag-handle bg-white flex justify-between items-center border-b border-[#DADEE0] w-full h-[30px]">
            <div className="inline-flex items-center justify-center whitespace-nowrap space-x-2">
              <img
                src="images/spreadsheet.png"
                alt="Spreadsheet"
                className="w-[18px] h-[18px] mx-[10px] ml-[8px] text-[10px]"
              />
              <span className="text-[16px] font-medium text-[#475466] tracking-normal">
                Spreadsheet
              </span>
            </div>
            <div className="flex space-x-2 mr-3">
              {/* Minimize Button */}
              <button className="text-white text-lg hover:text-yellow-300 p-1 rounded-md w-[26px]">
                <i className="fa-solid fa-minus text-[#94A1B3]"></i>
              </button>
              {/* Maximize Button */}
              <button className="text-white text-lg hover:text-yellow-300 p-1 rounded-md w-[26px]">
                <i className="fa-regular fa-square text-[#94A1B3]"></i>
              </button>
              {/* Close Button */}
              <button className="text-white text-lg hover:text-yellow-300 p-1 rounded-md w-[26px]">
                <i className="fa-solid fa-xmark text-[#94A1B3]"></i>
              </button>
            </div>
          </div>
          {/* Body content */}
          <div className="mt-4 p-2">
            <h2>Hello Spreadsheet Content</h2>
          </div>
        </div>
      </Rnd>
    );
  };

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
            <DesktopIcon
              image={icon.image}
              title={icon.title}
              keyIcon={icon.key}
              onIconClick={handleIconClick}
            />
          </div>
        ))}
      </GridLayout>

      {selectedIcon === "spreadsheetIcon" && renderSpreadSheet()}
    </div>
  );
};

export default App;
