import { TreeItem } from '../components/TreeExplorer';

// Original JSON format structure
export interface OriginalJsonFormat {
  [mainCategory: string]: MainCategoryData;
}

export interface MainCategoryData {
  glob: boolean;
  [categoryName: string]: any; // Categories as nested properties
}

export interface CategoryData {
  cat: Array<{ glob: boolean }>;
  [subcategoryName: string]: any; // Subcategories as nested properties
}

export interface SubcategoryData {
  subcat: Array<{ glob: boolean; word: string; vars: string[] }>;
  key: Array<{ glob: boolean; word: string; vars: string[] }>;
}

// Convert from original JSON format to TreeItem array
export function convertFromOriginalFormat(data: OriginalJsonFormat): TreeItem[] {
  const result: TreeItem[] = [];
  let mainIndex = 1;

  // Level 1: Main Categories
  for (const [mainCategoryName, mainCategoryData] of Object.entries(data)) {
    const mainId = `${mainIndex}`;
    const mainItem: TreeItem = {
      id: mainId,
      name: mainCategoryName,
      level: 1,
      isGlobal: mainCategoryData.glob,
      variants: [],
      children: [],
    };

    let categoryIndex = 1;

    // Level 2: Categories (all properties except 'glob')
    for (const [categoryName, categoryData] of Object.entries(mainCategoryData)) {
      if (categoryName === 'glob') continue;

      const categoryId = `${mainId}-${categoryIndex}`;
      const catArray = categoryData.cat as Array<{ glob: boolean }>;
      const categoryItem: TreeItem = {
        id: categoryId,
        name: categoryName,
        level: 2,
        isGlobal: catArray?.[0]?.glob || false,
        variants: [],
        children: [],
      };

      let subcategoryIndex = 1;

      // Level 3: Subcategories (all properties except 'cat')
      for (const [subcategoryName, subcategoryData] of Object.entries(categoryData)) {
        if (subcategoryName === 'cat') continue;

        const subcategoryId = `${categoryId}-${subcategoryIndex}`;
        const subcatArray = subcategoryData.subcat as Array<{ glob: boolean; word: string; vars: string[] }>;
        const keyArray = subcategoryData.key as Array<{ glob: boolean; word: string; vars: string[] }>;

        const subcategoryItem: TreeItem = {
          id: subcategoryId,
          name: subcategoryName,
          level: 3,
          isGlobal: subcatArray?.[0]?.glob || false,
          variants: subcatArray?.[0]?.vars || [],
          children: [],
        };

        // Level 4: Keys (items in the key array)
        if (keyArray && keyArray.length > 0) {
          keyArray.forEach((keyItem, keyIndex) => {
            const keyId = `${subcategoryId}-${keyIndex + 1}`;
            subcategoryItem.children!.push({
              id: keyId,
              name: keyItem.word,
              level: 4,
              isGlobal: keyItem.glob,
              variants: keyItem.vars || [],
            });
          });
        }

        categoryItem.children!.push(subcategoryItem);
        subcategoryIndex++;
      }

      mainItem.children!.push(categoryItem);
      categoryIndex++;
    }

    result.push(mainItem);
    mainIndex++;
  }

  return result;
}

// Convert from TreeItem array back to original JSON format
export function convertToOriginalFormat(items: TreeItem[]): OriginalJsonFormat {
  const result: OriginalJsonFormat = {};

  // Level 1: Main Categories
  items.forEach((mainItem) => {
    if (mainItem.level !== 1) return;

    const mainCategoryData: MainCategoryData = {
      glob: mainItem.isGlobal,
    };

    // Level 2: Categories
    mainItem.children?.forEach((categoryItem) => {
      if (categoryItem.level !== 2) return;

      const categoryData: any = {
        cat: [{ glob: categoryItem.isGlobal }],
      };

      // Level 3: Subcategories
      categoryItem.children?.forEach((subcategoryItem) => {
        if (subcategoryItem.level !== 3) return;

        const subcategoryData: SubcategoryData = {
          subcat: [{
            glob: subcategoryItem.isGlobal,
            word: subcategoryItem.name,
            vars: subcategoryItem.variants || [],
          }],
          key: [],
        };

        // Level 4: Keys
        if (subcategoryItem.children && subcategoryItem.children.length > 0) {
          subcategoryData.key = subcategoryItem.children.map((keyItem) => ({
            glob: keyItem.isGlobal,
            word: keyItem.name,
            vars: keyItem.variants || [],
          }));
        }

        categoryData[subcategoryItem.name] = subcategoryData;
      });

      mainCategoryData[categoryItem.name] = categoryData;
    });

    result[mainItem.name] = mainCategoryData;
  });

  return result;
}
