export interface SubCategoriesItem {
  id: string;
  name: string;
}

export interface CategorySelect {
  id: string;
  name: string;
  subCategories: SubCategoriesItem[];
  tags: [];
}

