import { IconData } from './icon-data.dto';

export type CategoryData = {
  id?: number;
  description: string;
  slug: string;
  iconId: number;
  userId: number;
  icon?: IconData;
};
