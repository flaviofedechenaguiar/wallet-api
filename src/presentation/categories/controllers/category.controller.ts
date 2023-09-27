import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/presentation/users/guards/auth.guard';
import { CategoryCreateUseCase } from 'src/domain/categories/usecases/create-category.usecase';
import { CreateCategoryRequest } from '../dtos/create-category.dto';
import { UpdateCategoryRequest } from '../dtos/update-category.dto';
import { CategoryUpdateUseCase } from 'src/domain/categories/usecases/update-category.usecase';
import { GetCategoryOutput } from '../dtos/get-category.dto';
import { CategoryGetUseCase } from 'src/domain/categories/usecases/get-category.usecase';
import { CategoryGetAllUseCase } from 'src/domain/categories/usecases/get-all-category.usecase';
import { GetAllCategoryOutput } from '../dtos/get-all-category.dto';
import { CategoryDeleteUseCase } from 'src/domain/categories/usecases/delete-wallet.usecase';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryCreateUseCase: CategoryCreateUseCase,
    private readonly categoryUpdateUseCase: CategoryUpdateUseCase,
    private readonly categoryGetUseCase: CategoryGetUseCase,
    private readonly categoryGetAllUseCase: CategoryGetAllUseCase,
    private readonly categoryDeleteUseCase: CategoryDeleteUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async store(
    @Request() request: Request,
    @Body() body: CreateCategoryRequest,
  ): Promise<void> {
    const userId = request['userId'];
    await this.categoryCreateUseCase.execute({
      description: body.description,
      userId: +userId,
      iconId: body.icon_id,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() request: Request,
    @Body() body: UpdateCategoryRequest,
  ): Promise<void> {
    const userId = request['userId'];
    await this.categoryUpdateUseCase.execute({
      id: +id,
      description: body.description,
      userId: userId,
      iconId: body.icon_id,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get(':id')
  async index(
    @Param('id') id: string,
    @Request() request: Request,
  ): Promise<GetCategoryOutput> {
    const userId = request['userId'];
    const result = await this.categoryGetUseCase.execute({
      id: +id,
      userId: +userId,
    });

    return {
      id: result.id,
      description: result.description,
      icon: {
        id: result.icon.id,
        description: result.icon.desription,
        data: result.icon.data,
      },
    };
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get()
  async show(@Request() request: Request): Promise<GetAllCategoryOutput> {
    const userId = request['userId'];
    const categories = await this.categoryGetAllUseCase.execute(+userId);

    return categories.map((category) => ({
      id: category.id,
      description: category.description,
      icon: {
        id: category.icon.id,
        description: category.icon.desription,
        data: category.icon.data,
      },
    }));
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async destroy(
    @Request() request: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = request['userId'];
    await this.categoryDeleteUseCase.execute(+id, +userId);
  }
}
