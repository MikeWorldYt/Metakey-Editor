import { useState } from "react";
import { Toolbar } from "./components/Toolbar";
import {
  TreeExplorer,
  TreeItem,
} from "./components/TreeExplorer";
import { PropertiesPanel } from "./components/PropertiesPanel";

// Sample data structure with 3 levels
const initialData: TreeItem[] = [
  {
    id: "1",
    name: "PERSONAL",
    level: 1,
    isGlobal: false,
    variants: [],
    children: [
      {
        id: "1-1",
        name: "Documentation",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "1-1-1",
            name: "Identidity",
            level: 3,
            isGlobal: true,
            variants: [
              "Passport",
              "License",
              "ID Card",
              "Your Name"
            ],
          },
          {
            id: "1-1-2",
            name: "Hosehold",
            level: 3,
            isGlobal: false,
            variants: [],
          },
        ],
      },
      {
        id: "1-2",
        name: "Personal Gallery",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "1-2-1",
            name: "Family",
            level: 3,
            isGlobal: false,
            variants: [],
          },
          {
            id: "1-2-2",
            name: "Travels",
            level: 3,
            isGlobal: false,
            variants: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "WORK",
    level: 1,
    isGlobal: false,
    variants: [],
    children: [
      {
        id: "2-1",
        name: "Documentation",
        level: 2,
        isGlobal: true,
        variants: [],
        children: [
          {
            id: "2-1-1",
            name: "Incident Reports",
            level: 3,
            isGlobal: false,
            variants: [
              "Hardware Failure",
              "Software Bug",
              "Network Outage",
              "User Error"
            ],
          },
          {
            id: "2-1-2",
            name: "Maintenance Logs",
            level: 3,
            isGlobal: false,
            variants: [
              "Scheduled Check",
              "Firmware Update",
              "Driver Install",
              "Thermal Inspection",
              "Security Audit"
            ],
          },
          {
            id: "2-1-3",
            name: "Client Profiles",
            level: 3,
            isGlobal: true,
            variants: [
              "Company Name",
              "Contact Info",
              "Device Inventory",
              "Service History"
            ],
          },
        ],
      },
      {
        id: "2-2",
        name: "Software Tools",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "2-2-1",
            name: "Diagnostic Tools",
            level: 3,
            isGlobal: true,
            variants: [
              "Procmon",
              "Sysmon",
              "Wireshark",
              "PowerShell",
              "Diagnostic",
            ],
          },
          {
            id: "2-2-2",
            name: "Remote Support SS",
            level: 3,
            isGlobal: true,
            variants: [
              "TeamViewer",
              "AnyDesk",
              "Remote Support",
              "Screenshot"
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "COLLEGE",
    level: 1,
    isGlobal: false,
    variants: [],
    children: [
      {
        id: "3-1",
        name: "Courses",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "3-1-1",
            name: "Statistics",
            level: 3,
            isGlobal: false,
            variants: [
              "Probability",
              "Regression",
              "Hypothesis Testing",
              "Bayesian Methods"
            ],
          },
          {
            id: "3-1-2",
            name: "Machine Learning",
            level: 3,
            isGlobal: true,
            variants: [
              "Supervised Learning",
              "Unsupervised Learning",
              "Neural Networks",
              "Model Evaluation"
            ],
          },
        ],
      },
      {
        id: "3-2",
        name: "Tools",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "3-2-1",
            name: "Programming",
            level: 3,
            isGlobal: true,
            variants: [
              "Python",
              "R",
              "SQL",
              "Julia"
            ],
          },
          {
            id: "3-2-2",
            name: "Libraries",
            level: 3,
            isGlobal: false,
            variants: [
              "Pandas",
              "NumPy",
              "Scikit-learn",
              "TensorFlow"
            ],
          },
        ],
      },
      {
        id: "3-3",
        name: "Projects",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "3-3-1",
            name: "Data Analysis",
            level: 3,
            isGlobal: false,
            variants: [
              "Survey Data",
              "Financial Data",
              "Health Data",
              "Social Media Data"
            ],
          },
          {
            id: "3-3-2",
            name: "Capstone",
            level: 3,
            isGlobal: true,
            variants: [
              "Predictive Model",
              "Recommendation System",
              "Classification Task",
              "Visualization Dashboard"
            ],
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "HOBBIES",
    level: 1,
    isGlobal: false,
    variants: [],
    children: [
      {
        id: "4-1",
        name: "Steam Games",
        level: 2,
        isGlobal: false,
        variants: [],
        children: [
          {
            id: "4-1-1",
            name: "Blue Archive",
            level: 3,
            isGlobal: false,
            variants: [
              "Story Mode",
              "Character Collection",
              "Events",
              "PvP"
            ],
          },
          {
            id: "4-1-2",
            name: "Counter-Strike 2",
            level: 3,
            isGlobal: false,
            variants: [
              "Competitive",
              "Casual",
              "Deathmatch",
              "Workshop Maps"
            ],
          },
        ],
      },
    ],
  }
];

export default function App() {
  const [data, setData] = useState<TreeItem[]>(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [expandedAll, setExpandedAll] = useState(false);

  // Find selected item in the tree
  const findItemById = (
    items: TreeItem[],
    id: string,
  ): TreeItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update item in the tree
  const updateItemById = (
    items: TreeItem[],
    id: string,
    updatedItem: TreeItem,
  ): TreeItem[] => {
    return items.map((item) => {
      if (item.id === id) {
        return updatedItem;
      }
      if (item.children) {
        return {
          ...item,
          children: updateItemById(
            item.children,
            id,
            updatedItem,
          ),
        };
      }
      return item;
    });
  };

  const selectedItem = selectedId
    ? findItemById(data, selectedId)
    : null;

  const handleSaveChanges = (updatedItem: TreeItem) => {
    setData(updateItemById(data, updatedItem.id, updatedItem));
    setIsEditing(false);
  };

  // Toolbar handlers
  const handleOpen = () => {
    alert("Open functionality would load a file here");
  };

  const handleSave = () => {
    alert("Save functionality would save the current data");
    console.log("Data to save:", data);
  };

  const handleSaveAs = () => {
    alert("Save As functionality would save to a new file");
  };

  const handleAdd = () => {
    alert(
      "Add functionality would create a new item. Implement dialog to specify parent and level.",
    );
  };

  const handleDelete = () => {
    if (
      selectedId &&
      confirm("Are you sure you want to delete this item?")
    ) {
      // Implementation for delete would go here
      alert(
        "Delete functionality would remove the selected item",
      );
    }
  };

  const handleExpandCollapseAll = () => {
    setExpandedAll(!expandedAll);
  };

  const handleFind = () => {
    const searchTerm = prompt("Enter search term:");
    if (searchTerm) {
      alert(
        `Search functionality would find items matching: ${searchTerm}`,
      );
    }
  };

  const handleSelectAll = () => {
    alert("Select All functionality would select all items");
  };

  const handleDeselectAll = () => {
    setSelectedId(null);
  };

  const handleImport = () => {
    alert("Import functionality would load data from a file");
  };

  const handleExport = () => {
    alert("Export functionality would export data to a file");
    console.log(
      "Data to export:",
      JSON.stringify(data, null, 2),
    );
  };

  const handleHelp = () => {
    alert(
      "Help:\n\n- Use the tree on the left to browse items\n- Select an item to view its properties\n- Click Edit to modify properties\n- Add variants to items in edit mode\n- Use toolbar buttons for file operations",
    );
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      {/* Toolbar */}
      <Toolbar
        onOpen={handleOpen}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onExpandCollapseAll={handleExpandCollapseAll}
        onFind={handleFind}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onImport={handleImport}
        onExport={handleExport}
        onHelp={handleHelp}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSaveChanges={() => {
          if (selectedItem) {
            handleSaveChanges(selectedItem);
          }
        }}
        onCancelEdit={() => setIsEditing(false)}
        hasSelection={selectedId !== null}
        expandedAll={expandedAll}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tree Explorer */}
        <div className="w-80 flex-shrink-0">
          <TreeExplorer
            items={data}
            selectedId={selectedId}
            onSelect={setSelectedId}
            expandedAll={expandedAll}
          />
        </div>

        {/* Right Panel - Properties */}
        <div className="flex-1">
          <PropertiesPanel
            selectedItem={selectedItem}
            isEditing={isEditing}
            onSave={handleSaveChanges}
          />
        </div>
      </div>
    </div>
  );
}