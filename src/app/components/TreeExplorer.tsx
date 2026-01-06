import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

export interface TreeItem {
  id: string;
  name: string;
  level: number;
  children?: TreeItem[];
  isGlobal?: boolean;
  variants?: string[];
}

interface TreeExplorerProps {
  items: TreeItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  expandedAll: boolean;
}

export function TreeExplorer({ items, selectedId, onSelect, expandedAll }: TreeExplorerProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (expandedAll) {
      const allIds = new Set<string>();
      const collectIds = (items: TreeItem[]) => {
        items.forEach(item => {
          if (item.children && item.children.length > 0) {
            allIds.add(item.id);
            collectIds(item.children);
          }
        });
      };
      collectIds(items);
      setExpandedIds(allIds);
    } else {
      setExpandedIds(new Set());
    }
  }, [expandedAll, items]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItem = (item: TreeItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const isSelected = selectedId === item.id;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-neutral-200 ${
            isSelected ? 'bg-blue-100 hover:bg-blue-200' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => onSelect(item.id)}
          onDoubleClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            }
          }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              className="p-0.5 hover:bg-neutral-300 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-600" />
            ) : (
              <Folder className="w-4 h-4 text-amber-600" />
            )
          ) : (
            <div className="w-4 h-4 ml-0.5 bg-neutral-400 rounded-sm" />
          )}
          <span className="text-sm select-none">{item.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto bg-white border-r border-neutral-300">
      <div className="py-1">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
}