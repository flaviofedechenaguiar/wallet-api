import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryDeleteUseCase implements IUseCase {
  public constructor(private categoryRepositor: CategoryRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    await this.categoryRepositor.delete(id, userId);
  }
}
