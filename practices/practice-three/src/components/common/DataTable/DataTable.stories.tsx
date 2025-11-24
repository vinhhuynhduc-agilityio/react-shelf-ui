import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DataTable from ".";
import type { ColumnsType } from "antd/es/table";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A customizable data table component built on Ant Design Table. Supports vertical and horizontal scrolling, loading states, and tree data structure. Features dynamic height control and responsive layout.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      description: "Column definitions for the table",
      table: {
        type: { summary: "ColumnsType<T>" },
      },
      control: false,
    },
    dataSource: {
      description: "Array of data to display in the table",
      table: {
        type: { summary: "T[]" },
      },
      control: false,
    },
    tableHeight: {
      description: "Height of the table viewport in pixels",
      control: { type: "number" },
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "400" },
      },
    },
    isLoading: {
      description: "Shows loading spinner when true",
      control: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isFetching: {
      description:
        "Indicates data is being fetched; shows loading spinner if true",
      control: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// Basic data type
interface SimpleRecord {
  key: string;
  name: string;
  age: number;
  email: string;
  department: string;
}

// Tree data type
interface TreeRecord {
  key: string;
  name: string;
  position: string;
  salary: number;
  children?: TreeRecord[];
}

// Simple data
const simpleData: SimpleRecord[] = [
  {
    key: "1",
    name: "Declan Whitaker",
    age: 28,
    email: "declan.whitaker@company.co",
    department: "Engineering",
  },
  {
    key: "2",
    name: "Marisol Delgado",
    age: 32,
    email: "marisol.delgado@company.co",
    department: "Product",
  },
  {
    key: "3",
    name: "Ronan Fletcher",
    age: 25,
    email: "ronan.fletcher@company.co",
    department: "Design",
  },
  {
    key: "4",
    name: "Siena Moreau",
    age: 29,
    email: "siena.moreau@company.co",
    department: "Engineering",
  },
  {
    key: "5",
    name: "Cassian Holt",
    age: 31,
    email: "cassian.holt@company.co",
    department: "Sales",
  },
];

// Tree data
const treeData: TreeRecord[] = [
  {
    key: "1",
    name: "CEO",
    position: "Chief Executive Officer",
    salary: 150000,
    children: [
      {
        key: "1-1",
        name: "VP Engineering",
        position: "Vice President",
        salary: 120000,
        children: [
          {
            key: "1-1-1",
            name: "Senior Engineer",
            position: "Engineering Lead",
            salary: 90000,
          },
          {
            key: "1-1-2",
            name: "Software Engineer",
            position: "Backend Developer",
            salary: 80000,
          },
          {
            key: "1-1-3",
            name: "Software Engineer",
            position: "Frontend Developer",
            salary: 80000,
          },
        ],
      },
      {
        key: "1-2",
        name: "VP Product",
        position: "Vice President",
        salary: 115000,
        children: [
          {
            key: "1-2-1",
            name: "Product Manager",
            position: "Senior Product Manager",
            salary: 85000,
          },
          {
            key: "1-2-2",
            name: "Product Manager",
            position: "Product Manager",
            salary: 75000,
          },
        ],
      },
      {
        key: "1-3",
        name: "VP Design",
        position: "Vice President",
        salary: 110000,
        children: [
          {
            key: "1-3-1",
            name: "Design Lead",
            position: "Senior Designer",
            salary: 80000,
          },
          {
            key: "1-3-2",
            name: "UX Designer",
            position: "UX/UI Designer",
            salary: 70000,
          },
        ],
      },
    ],
  },
];

// ============================================
// Basic Table Demo Component
// ============================================
const BasicDemo = () => {
  const columns: ColumnsType<SimpleRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 120,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 p-3 rounded border border-blue-300">
        <p className="text-sm text-blue-900 font-medium">
          Total Records: <span className="font-bold">{simpleData.length}</span>
        </p>
      </div>
      <DataTable<SimpleRecord>
        columns={columns}
        dataSource={simpleData}
        tableHeight={400}
      />
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Basic data table with simple records. Shows vertical scrolling for controlled table height.",
      },
    },
  },
};

// ============================================
// Tree Data Demo Component
// ============================================
const TreeDataDemo = () => {
  const columns: ColumnsType<TreeRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 200,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      width: 120,
      render: (salary: number) => `$${salary.toLocaleString()}`,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="bg-purple-50 p-3 rounded border border-purple-300 space-y-2">
        <p className="text-sm text-purple-900 font-semibold">
          Organization Hierarchy
        </p>
        <p className="text-xs text-purple-800">
          Click on rows to expand/collapse the tree structure
        </p>
      </div>
      <DataTable<TreeRecord>
        columns={columns}
        dataSource={treeData}
        tableHeight={500}
      />
    </div>
  );
};

export const TreeData: Story = {
  render: () => <TreeDataDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Data table with tree structure showing organizational hierarchy. Click rows to expand/collapse child nodes.",
      },
    },
  },
};

// ============================================
// Large Dataset Demo Component
// ============================================
const LargeDatasetDemo = () => {
  const generateLargeData = (count: number): SimpleRecord[] => {
    const departments = [
      "Engineering",
      "Product",
      "Design",
      "Sales",
      "Marketing",
      "HR",
    ];
    const names = [
      "Declan",
      "Marisol",
      "Ronan",
      "Siena",
      "Cassian",
      "Elowen",
      "Tavish",
      "Amara",
    ];

    return Array.from({ length: count }, (_, i) => ({
      key: `${i + 1}`,
      name: `${names[i % names.length]} ${String(i + 1).padStart(3, "0")}`,
      age: 20 + (i % 40),
      email: `user${i + 1}@example.com`,
      department: departments[i % departments.length],
    }));
  };

  const largeData = generateLargeData(50);

  const columns: ColumnsType<SimpleRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 100,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 120,
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="bg-green-50 p-3 rounded border border-green-300 space-y-2">
        <p className="text-sm text-green-900 font-semibold">
          Large Dataset Example
        </p>
        <p className="text-xs text-green-800">
          Total Records: <span className="font-bold">{largeData.length}</span>
          {" - Scroll vertically and horizontally to see all data"}
        </p>
      </div>
      <DataTable<SimpleRecord>
        columns={columns}
        dataSource={largeData}
        tableHeight={500}
      />
    </div>
  );
};

export const LargeDataset: Story = {
  render: () => <LargeDatasetDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Data table with 50 records showing vertical scrolling and sorting capabilities.",
      },
    },
  },
};

// ============================================
// Loading State Demo Component
// ============================================
const LoadingStateDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnsType<SimpleRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 120,
    },
  ];

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      <button
        onClick={handleSimulateLoading}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "🔄 Loading..." : "Simulate Loading"}
      </button>

      {isLoading && (
        <div className="bg-blue-50 p-4 rounded border border-blue-300 space-y-2">
          <p className="text-sm font-semibold text-blue-900">
            📊 Loading data...
          </p>
          <p className="text-xs text-blue-700">
            Shows spinner while keeping data visible. Will complete in 2
            seconds.
          </p>
        </div>
      )}

      <DataTable<SimpleRecord>
        columns={columns}
        dataSource={simpleData}
        tableHeight={400}
        isLoading={isLoading}
      />
    </div>
  );
};

export const LoadingState: Story = {
  render: () => <LoadingStateDemo />,
  parameters: {
    decorators: [
      (Story: React.ComponentType) => (
        <div className="w-full bg-gray-100 flex items-start justify-center p-8 min-h-screen">
          <div className="w-full max-w-4xl">
            <Story />
          </div>
        </div>
      ),
    ],
    docs: {
      description: {
        story:
          "Data table with loading state. Click button to simulate loading with spinner overlay on existing data.",
      },
    },
  },
};

// ============================================
// Interactive Controls Demo Component
// ============================================
const InteractiveControlsDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableHeight, setTableHeight] = useState(400);
  const [dataCount, setDataCount] = useState(10);

  const generateData = (count: number): SimpleRecord[] => {
    const departments = [
      "Engineering",
      "Product",
      "Design",
      "Sales",
      "Marketing",
    ];
    const names = ["Declan", "Marisol", "Ronan", "Siena", "Cassian"];

    return Array.from({ length: count }, (_, i) => ({
      key: `${i + 1}`,
      name: `${names[i % names.length]} ${String(i + 1).padStart(2, "0")}`,
      age: 20 + (i % 40),
      email: `user${i + 1}@example.com`,
      department: departments[i % departments.length],
    }));
  };

  const columns: ColumnsType<SimpleRecord> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 120,
    },
  ];

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="w-full space-y-4 max-w-4xl">
      <h3 className="text-lg font-semibold text-gray-900">
        Interactive DataTable Controls
      </h3>

      {/* Controls Section */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border-2 border-gray-300">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">
            Table Height: <span className="text-blue-600">{tableHeight}px</span>
          </label>
          <input
            type="range"
            min="200"
            max="600"
            step="50"
            value={tableHeight}
            onChange={(e) => setTableHeight(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">
            Record Count:{" "}
            <span className="text-blue-600">{dataCount} records</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={dataCount}
            onChange={(e) => setDataCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSimulateLoading}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors col-span-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "🔄 Loading..." : "Simulate Loading"}
        </button>
      </div>

      {/* Status Message */}
      {isLoading && (
        <div className="bg-blue-50 p-4 rounded border border-blue-300 space-y-2">
          <p className="text-sm font-semibold text-blue-900">
            📊 Loading table data...
          </p>
          <p className="text-xs text-blue-700">
            Shows spinner overlay while keeping data visible
          </p>
        </div>
      )}

      {/* Status Display */}
      <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-300">
        <p className="text-sm text-gray-900 font-semibold">
          Status:{" "}
          <span className="font-bold text-gray-700">
            {isLoading ? "🔄 Loading" : `✓ Ready (${dataCount} records)`}
          </span>
        </p>
      </div>

      {/* Table */}
      <DataTable<SimpleRecord>
        columns={columns}
        dataSource={generateData(dataCount)}
        tableHeight={tableHeight}
        isLoading={isLoading}
      />
    </div>
  );
};

export const InteractiveControls: Story = {
  render: () => <InteractiveControlsDemo />,
  parameters: {
    decorators: [
      (Story: React.ComponentType) => (
        <div className="w-full bg-gray-100 flex items-start justify-center p-8 min-h-screen">
          <Story />
        </div>
      ),
    ],
    docs: {
      description: {
        story:
          "Interactive demo with controls to adjust table height, record count, and simulate loading state with spinner overlay.",
      },
    },
  },
};
