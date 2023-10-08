import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { CategoryRepository } from '../repositories/category.repository';
import { IBuildSlug } from 'src/domain/contracts/build-slug';
import { DomainError } from 'src/support/erros/domain.error';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateCategoryInput } from '../dtos/update-category.dto';

@Injectable()
export class CategoryUpdateUseCase implements IUseCase {
  public constructor(
    private categoryRepository: CategoryRepository,
    @Inject(IBuildSlug) private buildSlug: IBuildSlug,
  ) {}

  async execute(data: UpdateCategoryInput): Promise<void> {
    const slug = this.buildSlug.build(data.description);

    const hasCategoryWithSameSlug =
      await this.categoryRepository.queryBySlugAndUserId(slug, data.userId);

    const isSameOrNoCategory =
      !hasCategoryWithSameSlug || hasCategoryWithSameSlug.id === data.id;

    if (!isSameOrNoCategory)
      throw new DomainError('description', 'Categoria já existente');

    this.categoryRepository.update(data.id, { slug, ...data });
  }
}
