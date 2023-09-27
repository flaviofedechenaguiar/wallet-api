import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CategoryEntity } from '../models/category.model';
import { CreateCategoryData } from '../dtos/create-category-data.dto';
import { CategoryData } from '../dtos/category-data.dto';

export class CategoryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private category = this.dataSource.getRepository(CategoryEntity);

  async create(data: CreateCategoryData): Promise<void> {
    await this.category.save({
      description: data.description,
      slug: data.slug,
      icon_id: data.iconId,
      user_id: data.userId,
    });
  }

  async update(id: number, data: CreateCategoryData): Promise<void> {
    await this.category.save({
      id,
      description: data.description,
      slug: data.slug,
      icon_id: data.iconId,
      user_id: data.userId,
    });
  }

  async queryByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<CategoryData | null> {
    const result = await this.category.findOne({
      where: { id, user_id: userId },
    });
    if (!result) return null;

    return {
      id: result.id,
      description: result.description,
      slug: result.slug,
      iconId: result.icon_id,
      userId: result.user_id,
    };
  }

  async queryByIdAndUserIdWithIcon(
    id: number,
    userId: number,
  ): Promise<CategoryData | null> {
    const result = await this.category.findOne({
      where: { id, user_id: userId },
      relations: { icon: true },
    });
    if (!result) return null;

    return {
      id: result.id,
      description: result.description,
      slug: result.slug,
      iconId: result.icon_id,
      userId: result.user_id,
      icon: {
        id: result.icon.id,
        desription: result.icon.description,
        data: result.icon.data,
      },
    };
  }

  async queryAllByUserIdWithIcon(userId: number): Promise<CategoryData[]> {
    const results = await this.category.find({
      where: { user_id: userId },
      relations: { icon: true },
    });

    return results.map((result) => ({
      id: result.id,
      description: result.description,
      slug: result.slug,
      iconId: result.icon_id,
      userId: result.user_id,
      icon: {
        id: result.icon.id,
        desription: result.icon.description,
        data: result.icon.data,
      },
    }));
  }

  async queryBySlugAndUserId(
    slug: string,
    userId: number,
  ): Promise<CategoryData | null> {
    const result = await this.category.findOne({
      where: { slug, user_id: userId },
    });
    if (!result) return null;

    return {
      id: result.id,
      description: result.description,
      slug: result.slug,
      iconId: result.icon_id,
      userId: result.user_id,
    };
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.category.softDelete({ id, user_id: userId });
  }
}
