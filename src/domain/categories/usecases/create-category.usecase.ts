import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryInput } from '../dtos/create-category.dto';
import { IBuildSlug } from 'src/domain/contracts/build-slug';
import { DomainError } from 'src/support/erros/domain.error';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryCreateUseCase implements IUseCase {
  public constructor(
    private categoryRepository: CategoryRepository,
    @Inject(IBuildSlug) private buildSlug: IBuildSlug,
  ) {}

  async execute(data: CreateCategoryInput): Promise<void> {
    const slug = this.buildSlug.build(data.description);
    const hasCategoryWithSameSlug =
      await this.categoryRepository.queryBySlugAndUserId(slug, data.userId);

    if (hasCategoryWithSameSlug)
      throw new DomainError('Category already existis');

    this.categoryRepository.create({ slug, ...data });
  }
}
