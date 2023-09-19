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

const TypeORMEntities = [SQLiteUserEntity, SQLiteWalletEntity];

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
];

@Module({
  imports: [TypeORMSettings, JWTSettings],
  controllers: [UserController, WalletController],
  providers: [
    UserRepository,
    WalletRepository,

    //ANCHOR: Others
    JWTAuthentication,
    EncryptBCryptProvider,
    ...UseCasesProviders,
    AuthGuard,
    SlugifyBuildSlug,
  ],
})
export class AppModule {}
