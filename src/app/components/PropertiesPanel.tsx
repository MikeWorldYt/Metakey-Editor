import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { TreeItem } from './TreeExplorer';

interface PropertiesPanelProps {
  selectedItem: TreeItem | null;
  isEditing: boolean;
  onSave: (item: TreeItem) => void;
}

export function PropertiesPanel({ selectedItem, isEditing, onSave }: PropertiesPanelProps) {
  const [itemName, setItemName] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [newVariant, setNewVariant] = useState('');

  useEffect(() => {
    if (selectedItem) {
      setItemName(selectedItem.name);
      setIsGlobal(selectedItem.isGlobal || false);
      setVariants(selectedItem.variants || []);
    } else {
      setItemName('');
      setIsGlobal(false);
      setVariants([]);
    }
    setNewVariant('');
  }, [selectedItem]);

  const handleAddVariant = () => {
    if (newVariant.trim() && !variants.includes(newVariant.trim())) {
      setVariants([...variants, newVariant.trim()]);
      setNewVariant('');
    }
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (selectedItem) {
      onSave({
        ...selectedItem,
        name: itemName,
        isGlobal,
        variants,
      });
    }
  };

  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50 text-neutral-500">
        <p>Select an item to view properties</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto p-4">
        <h2 className="mb-4 pb-2 border-b border-neutral-300">Properties</h2>
        
        {/* Item Name */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm">
            Item Name
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-neutral-300 rounded bg-white disabled:bg-neutral-100 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Global Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
              disabled={!isEditing}
              className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm">Global Item</span>
          </label>
        </div>

        {/* Variants List */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm">
            Variants
          </label>
          
          {/* Add Variant Input */}
          {isEditing && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newVariant}
                onChange={(e) => setNewVariant(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddVariant();
                  }
                }}
                placeholder="Add variant..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm"
              />
              <button
                onClick={handleAddVariant}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                title="Add Variant"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Variants List */}
          <div className="border border-neutral-300 rounded min-h-[150px] max-h-[300px] overflow-auto">
            {variants.length === 0 ? (
              <div className="p-3 text-sm text-neutral-500 text-center">
                No variants added
              </div>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {variants.map((variant, index) => (
                  <li key={index} className="flex items-center justify-between p-2 hover:bg-neutral-50">
                    <span className="text-sm">{variant}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveVariant(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remove Variant"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="p-4 border-t border-neutral-300 bg-neutral-50">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
