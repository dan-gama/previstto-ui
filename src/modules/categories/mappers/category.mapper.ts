import { CreateCategoryCommand } from '../models/category.command';
import { CategoryForm } from '../models/category.model';

export class CategoryMapper {
  static toCreate(form: CategoryForm): CreateCategoryCommand {
    return {
      name: form.name,
      active: form.active,
      forecast: form.forecast,
      parentId: form.parentId,
      subCategories: form.subCategories,
      tags: form.tags,
      type: form.type
    }
  }

  static toUpdate(form: CategoryForm): CreateCategoryCommand {
    return form;
  }
}
