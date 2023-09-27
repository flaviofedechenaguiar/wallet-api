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
  {
    provide: UserLoginUseCase,
    useFactory: (
      userRepository: UserRepository,
      walletRepository: WalletRepository,
      encrypt: IEncrypt,
      authentication: IJWTAuthentication,
    ) => {
      return new UserLoginUseCase(
        userRepository,
        walletRepository,
        encrypt,
        authentication,
      );
    },
    inject: [
      UserRepository,
      WalletRepository,
      EncryptBCrypt,
      JWTAuthentication,
    ],
  },
  {
    provide: UserGetAccountUseCaseCase,
    useFactory: (userRepository: UserRepository) => {
      return new UserGetAccountUseCaseCase(userRepository);
    },
    inject: [UserRepository],
  },
  {
    provide: UserCreateAccountUseCase,
    useFactory: (userRepository: UserRepository, encrypt: IEncrypt) => {
      return new UserCreateAccountUseCase(userRepository, encrypt);
    },
    inject: [UserRepository, EncryptBCrypt],
  },
  {
    provide: UserUpdateAccountUseCase,
    useFactory: (userRepository: UserRepository, encrypt: IEncrypt) => {
      return new UserUpdateAccountUseCase(userRepository, encrypt);
    },
    inject: [UserRepository, EncryptBCrypt],
  },
  {
    provide: UserDeleteAccountUseCase,
    useFactory: (userRepository: UserRepository) => {
      return new UserDeleteAccountUseCase(userRepository);
    },
    inject: [UserRepository],
  },
  {
    provide: UserVerifyAuthenticationUseCase,
    useFactory: (
      userRepository: UserRepository,
      authentication: IJWTAuthentication,
    ) => {
      return new UserVerifyAuthenticationUseCase(
        userRepository,
        authentication,
      );
    },
    inject: [UserRepository, JWTAuthentication],
  },

  //ANCHOR: WALLET
  {
    provide: WalletCreateUseCase,
    useFactory: (walletRepository: WalletRepository, buildSlug: IBuildSlug) => {
      return new WalletCreateUseCase(walletRepository, buildSlug);
    },
    inject: [WalletRepository, SlugifyBuildSlug],
  },
  {
    provide: WalletUpdateUseCase,
    useFactory: (walletRepository: WalletRepository, buildSlug: IBuildSlug) => {
      return new WalletUpdateUseCase(walletRepository, buildSlug);
    },
    inject: [WalletRepository, SlugifyBuildSlug],
  },
  WalletGetUseCase,
  WalletGetAllUseCase,
  WalletDeleteUseCase,
  CategoryCreateUseCase,
  CategoryUpdateUseCase,
  CategoryGetUseCase,
  CategoryGetAllUseCase,
  CategoryDeleteUseCase,
];

@Module({
  imports: [TypeORMSettings, JWTSettings],
  controllers: [UserController, WalletController, CategoryController],
  providers: [
    UserRepository,
    WalletRepository,
    CategoryRepository,

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
  ],
})
export class AppModule {}
