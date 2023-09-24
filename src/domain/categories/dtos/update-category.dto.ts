import { CreateCategoryData } from './create-category-data.dto';

export type UpdateCategoryInput = Omit<Required<CreateCategoryData>, 'slug'>;
