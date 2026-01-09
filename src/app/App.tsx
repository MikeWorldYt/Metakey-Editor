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

  // Delete item from the tree
  const deleteItemById = (
    items: TreeItem[],
    id: string,
  ): TreeItem[] => {
    return items
      .filter((item) => item.id !== id)
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: deleteItemById(item.children, id),
          };
        }
        return item;
      });
  };

  // Find parent and add sibling item
  const addSiblingItem = (
    items: TreeItem[],
    selectedId: string,
    newItemName: string,
  ): TreeItem[] | null => {
    // Find the selected item and its parent
    const findItemAndParent = (
      items: TreeItem[],
      id: string,
      parent: TreeItem | null = null,
    ): { item: TreeItem; parent: TreeItem | null; siblings: TreeItem[] } | null => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id === id) {
          return { item, parent, siblings: items };
        }
        if (item.children) {
          const found = findItemAndParent(item.children, id, item);
          if (found) return found;
        }
      }
      return null;
    };

    const result = findItemAndParent(items, selectedId);
    if (!result) return null;

    const { item: selectedItem, siblings } = result;
    
    // Generate new ID based on level
    const generateNewId = (level: number): string => {
      if (level === 1) {
        // Main category - find highest number
        const maxId = Math.max(...items.map(i => parseInt(i.id) || 0));
        return `${maxId + 1}`;
      } else {
        // For nested items, use the parent ID prefix and increment
        const idParts = selectedItem.id.split('-');
        const parentPrefix = idParts.slice(0, -1).join('-');
        const currentIndex = parseInt(idParts[idParts.length - 1]);
        
        // Find all siblings with same parent prefix
        const siblingIds = siblings
          .map(s => s.id)
          .filter(id => id.startsWith(parentPrefix + '-'));
        
        const maxSiblingIndex = Math.max(
          ...siblingIds.map(id => {
            const parts = id.split('-');
            return parseInt(parts[parts.length - 1]) || 0;
          })
        );
        
        return `${parentPrefix}-${maxSiblingIndex + 1}`;
      }
    };

    // Create new item based on level
    const newItem: TreeItem = {
      id: generateNewId(selectedItem.level),
      name: newItemName,
      level: selectedItem.level,
      isGlobal: false,
      variants: selectedItem.level >= 3 ? [] : undefined, // Only level 3 and 4 have variants
      children: selectedItem.level < 4 ? [] : undefined, // Only level 1-3 can have children
    };

    // Insert the new item after the selected item
    const insertNewItem = (items: TreeItem[]): TreeItem[] => {
      const newItems: TreeItem[] = [];
      for (const item of items) {
        if (item.id === selectedId) {
          newItems.push(item);
          newItems.push(newItem);
        } else {
          if (item.children) {
            newItems.push({
              ...item,
              children: insertNewItem(item.children),
            });
          } else {
            newItems.push(item);
          }
        }
      }
      return newItems;
    };

    return insertNewItem(items);
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
    if (!selectedId) {
      alert("Please select an item first");
      return;
    }
    
    const selectedItem = findItemById(data, selectedId);
    if (!selectedItem) return;
    
    // Get default name based on level
    const getDefaultName = (level: number): string => {
      switch (level) {
        case 1: return "New Main Category";
        case 2: return "New Category";
        case 3: return "New Subcategory";
        case 4: return "New Item";
        default: return "New Item";
      }
    };
    
    const newItemName = prompt("Enter new item name:", getDefaultName(selectedItem.level));
    if (newItemName) {
      const newData = addSiblingItem(data, selectedId, newItemName);
      if (newData) {
        setData(newData);
        // Keep the current selection or select the newly added item if needed
      }
    }
  };

  const handleDelete = () => {
    if (
      selectedId &&
      confirm("Are you sure you want to delete this item?")
    ) {
      const newData = deleteItemById(data, selectedId);
      setData(newData);
      setSelectedId(null);
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