import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { TreeItem } from './TreeExplorer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: TreeItem[];
  onSelectItem: (itemId: string, itemPath: string[]) => void;
}

interface SearchResult {
  item: TreeItem;
  path: string[];
  pathString: string;
}

export function SearchModal({ isOpen, onClose, items, onSelectItem }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const foundItems: SearchResult[] = [];

    const searchRecursive = (item: TreeItem, path: string[]) => {
      const currentPath = [...path, item.name];
      
      if (item.name.toLowerCase().includes(query)) {
        foundItems.push({
          item,
          path: currentPath,
          pathString: currentPath.join(' > ')
        });
      }

      if (item.children) {
        item.children.forEach(child => searchRecursive(child, currentPath));
      }
    };

    items.forEach(item => searchRecursive(item, []));
    setResults(foundItems);
    setSelectedIndex(0);
  }, [searchQuery, items]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const result = results[selectedIndex];
      handleSelectItem(result);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (result: SearchResult) => {
    // Get all parent IDs from the path
    const parentIds: string[] = [];
    const findParentIds = (item: TreeItem, targetId: string, currentPath: string[]): boolean => {
      if (item.id === targetId) {
        return true;
      }
      if (item.children) {
        for (const child of item.children) {
          if (findParentIds(child, targetId, [...currentPath, item.id])) {
            parentIds.unshift(...currentPath, item.id);
            return true;
          }
        }
      }
      return false;
    };

    items.forEach(item => findParentIds(item, result.item.id, []));
    
    onSelectItem(result.item.id, parentIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-[600px] max-h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-neutral-300">
          <Search className="w-5 h-5 text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for items..."
            className="flex-1 outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-200 rounded"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto">
          {searchQuery && results.length === 0 && (
            <div className="p-4 text-center text-neutral-500">
              No items found
            </div>
          )}
          {results.length > 0 && (
            <div>
              {results.map((result, index) => (
                <div
                  key={result.item.id}
                  className={`px-4 py-3 cursor-pointer border-b border-neutral-200 hover:bg-blue-50 ${
                    index === selectedIndex ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleSelectItem(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="font-medium text-sm">{result.item.name}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {result.pathString}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-neutral-300 bg-neutral-50 text-xs text-neutral-600 flex gap-4">
          <span><kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded">Enter</kbd> Select</span>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
