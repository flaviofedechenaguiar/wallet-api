import { CategoryData } from './category-data.dto';

export type CreateCategoryData = Omit<CategoryData, 'icon' | 'id'>;
