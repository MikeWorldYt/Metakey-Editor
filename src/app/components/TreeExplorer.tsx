import { useState, useEffect, useRef } from 'react';
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
  expandedIds: Set<string>;
  onToggleExpand: (expandedIds: Set<string>) => void;
  inlineEditingId: string | null;
  onInlineEditComplete: (itemId: string, newName: string) => void;
  onInlineEditCancel: (itemId: string) => void;
  pendingDeleteId: string | null;
}

export function TreeExplorer({ 
  items, 
  selectedId, 
  onSelect, 
  expandedAll, 
  expandedIds, 
  onToggleExpand,
  inlineEditingId,
  onInlineEditComplete,
  onInlineEditCancel,
  pendingDeleteId
}: TreeExplorerProps) {
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Auto-focus and select all text when entering edit mode
  useEffect(() => {
    if (inlineEditingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [inlineEditingId]);

  // Update shake animation when pendingDeleteId changes
  useEffect(() => {
    if (pendingDeleteId) {
      setShakeKey(prev => prev + 1);
    }
  }, [pendingDeleteId]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onToggleExpand(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onInlineEditComplete(itemId, editValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onInlineEditCancel(itemId);
    }
  };

  const renderItem = (item: TreeItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const isSelected = selectedId === item.id;
    const isInlineEditing = inlineEditingId === item.id;
    const isPendingDelete = pendingDeleteId === item.id;

    // Initialize edit value when starting to edit this item
    if (isInlineEditing && editValue === '') {
      setEditValue(item.name);
    }

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-neutral-200 ${
            isSelected ? 'bg-blue-100 hover:bg-blue-200' : ''
          } ${isPendingDelete ? 'shake-animation' : ''}`}
          key={isPendingDelete ? `${item.id}-${shakeKey}` : item.id}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => !isInlineEditing && onSelect(item.id)}
          onDoubleClick={() => {
            if (hasChildren && !isInlineEditing) {
              toggleExpand(item.id);
            }
          }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isInlineEditing) {
                  toggleExpand(item.id);
                }
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
          
          {isInlineEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              onBlur={() => onInlineEditComplete(item.id, editValue)}
              className="flex-1 text-sm px-1 py-0 bg-white border border-blue-500 rounded outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className={`text-sm select-none ${item.isGlobal ? 'font-bold' : ''} ${
                isPendingDelete ? 'text-red-600' : ''
              }`}
            >
              {item.name}
            </span>
          )}
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