import { IUseCase } from 'src/domain/contracts/usecase.contract';
import { Injectable } from '@nestjs/common';
import { IconRepository } from '../repositories/icon.repository';
import { IconData } from '../dtos/icon-data.dto';

@Injectable()
export class IconGetAllUseCase implements IUseCase {
  public constructor(private readonly iconRepository: IconRepository) {}

  async execute(): Promise<IconData[]> {
    const icons = await this.iconRepository.queryAll();

    return icons.map((icon) => ({
      id: icon.id,
      desription: icon.desription,
      data: icon.data,
    }));
  }
}
