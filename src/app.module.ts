import { Module } from '@nestjs/common';
import { AppController, WalletController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SQLiteUserEntity } from './infrastructure/sqlite/entities/user-sqlite.entity';
import { SQLiteUserRepository } from './infrastructure/sqlite/repositories/user-sqlite.repository';
import { JWTAuthentication } from './infrastructure/authentication';
import { EncryptBCrypt } from './infrastructure/encrypt';
import { UserCreateAccountUseCase } from './domain/usecases/user/create-account';
import { IUserRepository } from './domain/repositories/user/user.repository';
import { IEncrypt } from './domain/contracts/encrypt.contracts';
import { IJWTAuthentication } from './domain/contracts/jwt-authentication';
import { UserDeleteUseCase } from './domain/usecases/user/user-delete.usecase';
import { UserGetUseCase } from './domain/usecases/user/user-get';
import { UserLoginUseCase } from './domain/usecases/user/user-login';
import { AuthGuard } from './auth.guard';
import { UserVerifyAuthenticationUseCase } from './domain/usecases/user';
import { IAccountRepository } from './domain/repositories/account/account.repository';
import { SQLiteWalletEntity } from './infrastructure/sqlite/entities/wallet-sqlite.entity';
import { SQLiteAccountRepository } from './infrastructure/sqlite/repositories/account-sqlite.repository';
import { UserUpdateAccountUseCase } from './domain/usecases/user/update-account';
import { SQLiteWalletRepository } from './infrastructure/sqlite/repositories/wallet-sqlite.repository';
import { SlugifyBuildSlug } from './infrastructure/slug';
import { IWalletRepository } from './domain/repositories/wallet/wallet-repository';
import { WalletCreateUseCase } from './domain/usecases/wallet/wallet-create.usecase';
import { IBuildSlug } from './domain/contracts/build-slug';
import { WalletUpdateUseCase } from './domain/usecases/wallet/wallet-update';

const TypeORMEntities = [SQLiteUserEntity, , SQLiteWalletEntity];

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
      userRepository: IUserRepository,
      walletRepository: IWalletRepository,
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
      SQLiteUserRepository,
      SQLiteWalletRepository,
      EncryptBCrypt,
      JWTAuthentication,
    ],
  },
  {
    provide: UserGetUseCase,
    useFactory: (adminRepository: IUserRepository) => {
      return new UserGetUseCase(adminRepository);
    },
    inject: [SQLiteUserRepository],
  },
  {
    provide: UserCreateAccountUseCase,
    useFactory: (
      userRepository: IUserRepository,
      accountRepository: IAccountRepository,
      encrypt: IEncrypt,
    ) => {
      return new UserCreateAccountUseCase(
        userRepository,
        accountRepository,
        encrypt,
      );
    },
    inject: [SQLiteUserRepository, SQLiteAccountRepository, EncryptBCrypt],
  },
  {
    provide: UserUpdateAccountUseCase,
    useFactory: (adminRepository: IUserRepository, encrypt: IEncrypt) => {
      return new UserUpdateAccountUseCase(adminRepository, encrypt);
    },
    inject: [SQLiteUserRepository, EncryptBCrypt],
  },
  {
    provide: UserDeleteUseCase,
    useFactory: (adminRepository: IUserRepository) => {
      return new UserDeleteUseCase(adminRepository);
    },
    inject: [SQLiteUserRepository],
  },
  {
    provide: UserVerifyAuthenticationUseCase,
    useFactory: (
      userRepository: IUserRepository,
      authentication: IJWTAuthentication,
    ) => {
      return new UserVerifyAuthenticationUseCase(
        userRepository,
        authentication,
      );
    },
    inject: [SQLiteUserRepository, JWTAuthentication],
  },

  //ANCHOR: WALLET
  {
    provide: WalletCreateUseCase,
    useFactory: (
      walletRepository: IWalletRepository,
      buildSlug: IBuildSlug,
    ) => {
      return new WalletCreateUseCase(walletRepository, buildSlug);
    },
    inject: [SQLiteWalletRepository, SlugifyBuildSlug],
  },
  {
    provide: WalletUpdateUseCase,
    useFactory: (
      walletRepository: IWalletRepository,
      buildSlug: IBuildSlug,
    ) => {
      return new WalletUpdateUseCase(walletRepository, buildSlug);
    },
    inject: [SQLiteWalletRepository, SlugifyBuildSlug],
  },
];

@Module({
  imports: [TypeORMSettings, JWTSettings],
  controllers: [AppController, WalletController],
  providers: [
    //ANCHOR: Repository
    SQLiteUserRepository,
    SQLiteAccountRepository,
    SQLiteWalletRepository,

    //ANCHOR: Others
    JWTAuthentication,
    EncryptBCryptProvider,
    ...UseCasesProviders,
    AuthGuard,
    SlugifyBuildSlug,
  ],
})
export class AppModule {}
