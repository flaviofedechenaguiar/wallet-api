import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryData } from '../dtos/category-data.dto';

@Injectable()
export class CategoryGetAllUseCase implements IUseCase {
  public constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: number): Promise<CategoryData[]> {
    const categories = await this.categoryRepository.queryAllByUserIdWithIcon(
      userId,
    );

    return categories.filter((category) => category.iconId !== 1);
  }
}
