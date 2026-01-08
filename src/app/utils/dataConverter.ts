import { TreeItem } from '../components/TreeExplorer';

// Original JSON format
export interface OriginalJsonItem {
  word: string;
  glob: boolean;
  vars: string[];
  cat?: OriginalJsonItem[];
  subcat?: OriginalJsonItem[];
}

// Convert from original JSON format to TreeItem format
export function convertFromOriginalFormat(
  items: OriginalJsonItem[],
  parentId: string = '',
  level: number = 1
): TreeItem[] {
  return items.map((item, index) => {
    const id = parentId ? `${parentId}-${index + 1}` : `${index + 1}`;
    
    const treeItem: TreeItem = {
      id,
      name: item.word,
      level,
      isGlobal: item.glob,
      variants: item.vars || [],
    };

    // Handle children (either 'cat' for level 1 or 'subcat' for level 2)
    const children = item.cat || item.subcat;
    if (children && children.length > 0) {
      treeItem.children = convertFromOriginalFormat(children, id, level + 1);
    }

    return treeItem;
  });
}

// Convert from TreeItem format back to original JSON format
export function convertToOriginalFormat(items: TreeItem[]): OriginalJsonItem[] {
  return items.map((item) => {
    const originalItem: OriginalJsonItem = {
      word: item.name,
      glob: item.isGlobal || false,
      vars: item.variants || [],
    };

    // Add children based on level
    if (item.children && item.children.length > 0) {
      if (item.level === 1) {
        originalItem.cat = convertToOriginalFormat(item.children);
      } else if (item.level === 2) {
        originalItem.subcat = convertToOriginalFormat(item.children);
      }
    }

    return originalItem;
  });
}
