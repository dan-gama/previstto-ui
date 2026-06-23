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

// Interface estrita para os objetos do Quasar Select
export interface CategoryOption {
  label: string        // Usado internamente pelo Quasar para busca textual completa
  pureLabel: string    // Apenas o nome limpo (ex: "Smartphones")
  value: string | number
  disable?: boolean
  isSub: boolean
  parentName?: string  // Nome da categoria pai (ex: "Eletrônicos")
  tags: Array<string>
}

