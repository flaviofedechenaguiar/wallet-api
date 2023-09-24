import { CreateCategoryData } from './create-category-data.dto';

export type CreateCategoryInput = Omit<
  Required<CreateCategoryData>,
  'slug' | 'id'
>;
