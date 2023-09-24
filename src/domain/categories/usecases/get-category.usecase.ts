import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { DomainError } from 'src/support/erros/domain.error';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { GetCategoryInput } from '../dtos/get-category.dto';
import { CategoryData } from '../dtos/category-data.dto';

@Injectable()
export class CategoryGetUseCase implements IUseCase {
  public constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ id, userId }: GetCategoryInput): Promise<CategoryData> {
    const category = await this.categoryRepository.queryByIdAndUserIdWithIcon(
      id,
      userId,
    );
    if (!category) throw new DomainError('Category not found');

    return category;
  }
}
