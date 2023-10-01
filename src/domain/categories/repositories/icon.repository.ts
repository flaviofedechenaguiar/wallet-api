import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IconEntity } from '../models/icon.model';
import { IconData } from '../dtos/icon-data.dto';

export class IconRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private icon = this.dataSource.getRepository(IconEntity);

  async queryAll(): Promise<IconData[]> {
    const icons = await this.icon.find();

    return icons.map((icon) => ({
      id: icon.id,
      desription: icon.description,
      data: icon.data,
    }));
  }
}
