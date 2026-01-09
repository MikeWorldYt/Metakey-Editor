import { useState } from "react";
import { Toolbar } from "./components/Toolbar";
import {
  TreeExplorer,
  TreeItem,
} from "./components/TreeExplorer";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { convertFromOriginalFormat, convertToOriginalFormat, OriginalJsonFormat } from "./utils/dataConverter";
import originalData from "./data/treedata.json";

// Convert the imported JSON data to TreeItem format
const initialData: TreeItem[] = convertFromOriginalFormat(originalData as OriginalJsonFormat);

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
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result as string);
            const convertedData = convertFromOriginalFormat(jsonData);
            setData(convertedData);
            setSelectedId(null); // Clear selection when loading new data
            alert(`Successfully loaded: ${file.name}`);
          } catch (error) {
            alert(`Error loading file: ${error}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    // Convert data back to original format and save
    const originalFormat = convertToOriginalFormat(data);
    const jsonString = JSON.stringify(originalFormat, null, 2);
    
    // Create a blob and download it
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lib_keyword.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAs = () => {
    const filename = prompt("Enter filename:", "lib_keyword.json");
    if (filename) {
      const originalFormat = convertToOriginalFormat(data);
      const jsonString = JSON.stringify(originalFormat, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
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