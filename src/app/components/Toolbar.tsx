import { FolderOpen, Save, Plus, Trash2, ChevronsDownUp, Pencil, Check, Search, FileInput, FileOutput, CircleHelp, X } from 'lucide-react';

interface ToolbarProps {
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onAdd: () => void;
  onDelete: () => void;
  onExpandCollapseAll: () => void;
  onFind: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onImport: () => void;
  onExport: () => void;
  onHelp: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
  hasSelection: boolean;
  expandedAll: boolean;
}

export function Toolbar({
  onOpen,
  onSave,
  onSaveAs,
  onAdd,
  onDelete,
  onExpandCollapseAll,
  onFind,
  onSelectAll,
  onDeselectAll,
  onImport,
  onExport,
  onHelp,
  isEditing,
  onEdit,
  onSaveChanges,
  onCancelEdit,
  hasSelection,
  expandedAll,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-neutral-100 border-b border-neutral-300">
      {/* File Group */}
      <div className="flex items-center gap-1 pr-2 border-r border-neutral-300">
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Open"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Open</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Save"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
        <button
          onClick={onSaveAs}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Save As"
        >
          <Save className="w-4 h-4" />
          <span>Save As</span>
        </button>
      </div>

      {/* Items Group */}
      <div className="flex items-center gap-1 pr-2 border-r border-neutral-300">
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Add Item"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          title="Delete Item"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
        <button
          onClick={onExpandCollapseAll}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title={expandedAll ? "Collapse All" : "Expand All"}
        >
          <ChevronsDownUp className="w-4 h-4" />
          <span>{expandedAll ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {/* Edit Group */}
      <div className="flex items-center gap-1 pr-2 border-r border-neutral-300">
        {!isEditing ? (
          <button
            onClick={onEdit}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <>
            <button
              onClick={onSaveChanges}
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm bg-blue-100"
              title="Save Changes"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={onCancelEdit}
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
              title="Cancel"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </>
        )}
      </div>

      {/* App Group */}
      <div className="flex items-center gap-1">
        <button
          onClick={onFind}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Find"
        >
          <Search className="w-4 h-4" />
          <span>Find</span>
        </button>
        <button
          onClick={onSelectAll}
          className="px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Select All"
        >
          Select All
        </button>
        <button
          onClick={onDeselectAll}
          className="px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Deselect All"
        >
          Deselect
        </button>
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Import"
        >
          <FileInput className="w-4 h-4" />
          <span>Import</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Export"
        >
          <FileOutput className="w-4 h-4" />
          <span>Export</span>
        </button>
        <button
          onClick={onHelp}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-200 rounded text-sm"
          title="Help"
        >
          <CircleHelp className="w-4 h-4" />
          <span>Help</span>
        </button>
      </div>
    </div>
  );
}
