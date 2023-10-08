import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWTAuthentication } from './infrastructure/authentication';
import { EncryptBCrypt } from './infrastructure/encrypt';
import { IEncrypt } from './domain/contracts/encrypt.contracts';
import { IJWTAuthentication } from './domain/contracts/jwt-authentication';
import { SlugifyBuildSlug } from './infrastructure/slug';
import { IBuildSlug } from './domain/contracts/build-slug';
import { UserRepository } from './domain/users/repositories/user.repository';
import {
  UserCreateAccountUseCase,
  UserDeleteAccountUseCase,
  UserGetAccountUseCaseCase,
  UserLoginUseCase,
  UserUpdateAccountUseCase,
  UserVerifyAuthenticationUseCase,
} from './domain/users/usecases';
import { WalletRepository } from './domain/wallets/repositories/wallet.repository';
import {
  WalletCreateUseCase,
  WalletUpdateUseCase,
} from './domain/wallets/usecases';
import { SQLiteUserEntity } from './domain/users/models/user.model';
import { SQLiteWalletEntity } from './domain/wallets/models/wallet.model';
import { UserController } from './presentation/users/controllers/user.controller';
import { WalletController } from './presentation/wallets/controllers/wallet.controller';
import { AuthGuard } from './presentation/users/guards/auth.guard';
import { WalletGetUseCase } from './domain/wallets/usecases/get-wallet.usecase';
import { WalletGetAllUseCase } from './domain/wallets/usecases/get-all-wallet.usecase';
import { IconEntity } from './domain/categories/models/icon.model';
import { CategoryEntity } from './domain/categories/models/category.model';
import { CategoryController } from './presentation/categories/controllers/category.controller';
import { CategoryRepository } from './domain/categories/repositories/category.repository';
import { CategoryCreateUseCase } from './domain/categories/usecases/create-category.usecase';
import { CategoryUpdateUseCase } from './domain/categories/usecases/update-category.usecase';
import { CategoryGetUseCase } from './domain/categories/usecases/get-category.usecase';
import { CategoryGetAllUseCase } from './domain/categories/usecases/get-all-category.usecase';
import { WalletDeleteUseCase } from './domain/wallets/usecases/delete-wallet.usecase';
import { CategoryDeleteUseCase } from './domain/categories/usecases/delete-wallet.usecase';
import { IconRepository } from './domain/categories/repositories/icon.repository';
import { IconGetAllUseCase } from './domain/categories/usecases/get-all-icon.usecase';

const TypeORMEntities = [
  SQLiteUserEntity,
  SQLiteWalletEntity,
  IconEntity,
  CategoryEntity,
];

const TypeORMSettings = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'database.db',
  entities: TypeORMEntities,
  synchronize: true,
});

const JWTSettings = JwtModule.register({
  global: true,
  secret: 'o1tOGLS8KUPmdIDw9VTo2tNLLJXiPGK+LHjhAFY/pCy0yIbW4S2XPFSZAhwi2MBB',
  signOptions: { expiresIn: '3600s' },
});

const EncryptBCryptProvider = {
  provide: EncryptBCrypt,
  useFactory: () => {
    const SALT = 12;
    return new EncryptBCrypt(SALT);
  },
};

const UseCasesProviders = [
  UserLoginUseCase,
  UserGetAccountUseCaseCase,
  UserCreateAccountUseCase,
  UserUpdateAccountUseCase,
  UserDeleteAccountUseCase,
  UserVerifyAuthenticationUseCase,

  //ANCHOR: WALLET
  WalletCreateUseCase,
  WalletUpdateUseCase,
  WalletGetUseCase,
  WalletGetAllUseCase,
  WalletDeleteUseCase,

  //ANCHOR: CATEGORY
  CategoryCreateUseCase,
  CategoryUpdateUseCase,
  CategoryGetUseCase,
  CategoryGetAllUseCase,
  CategoryDeleteUseCase,
  IconGetAllUseCase,
];

@Module({
  imports: [TypeORMSettings, JWTSettings],
  controllers: [UserController, WalletController, CategoryController],
  providers: [
    UserRepository,
    WalletRepository,
    CategoryRepository,
    IconRepository,

    //ANCHOR: Others
    JWTAuthentication,
    EncryptBCryptProvider,
    ...UseCasesProviders,
    AuthGuard,
    SlugifyBuildSlug,
    {
      provide: IBuildSlug,
      useClass: SlugifyBuildSlug,
    },
    EncryptBCrypt,
    {
      provide: IEncrypt,
      useClass: EncryptBCrypt,
    },
    JWTAuthentication,
    {
      provide: IJWTAuthentication,
      useClass: JWTAuthentication,
    },
  ],
})
export class AppModule {}
