import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SQLiteUserEntity } from './infrastructure/sqlite/entities/user-sqlite.entity';
import { SQLiteUserRepository } from './infrastructure/sqlite/repositories/user-sqlite.repository';
import { JWTAuthentication } from './infrastructure/authentication';
import { EncryptBCrypt } from './infrastructure/encrypt';
import { UserCreateUseCase } from './domain/usecases/user/user-create.usecase';
import { IUserRepository } from './domain/repositories/user.repository';
import { IEncrypt } from './domain/contracts/encrypt.contracts';
import { IJWTAuthentication } from './domain/contracts/jwt-authentication';
import { UserUpdateUseCase } from './domain/usecases/user/user-update.usecase';
import { UserDeleteUseCase } from './domain/usecases/user/user-delete.usecase';
import { UserGetUseCase } from './domain/usecases/user/user-get.usecase';
import { UserLoginUseCase } from './domain/usecases/user/user-login.usecase';
import { AuthGuard } from './auth.guard';
import { UserVerifyAuthenticationUseCase } from './domain/usecases/user';

const TypeORMEntities = [SQLiteUserEntity];

const TypeORMSettings = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'database.db',
  entities: TypeORMEntities,
  synchronize: true,
});

const JWTSettings = JwtModule.register({
  global: true,
  secret: 'o1tOGLS8KUPmdIDw9VTo2tNLLJXiPGK+LHjhAFY/pCy0yIbW4S2XPFSZAhwi2MBB',
  signOptions: { expiresIn: '60s' },
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
      adminRepository: IUserRepository,
      encrypt: IEncrypt,
      authentication: IJWTAuthentication,
    ) => {
      return new UserLoginUseCase(adminRepository, encrypt, authentication);
    },
    inject: [SQLiteUserRepository, EncryptBCrypt, JWTAuthentication],
  },
  {
    provide: UserGetUseCase,
    useFactory: (adminRepository: IUserRepository) => {
      return new UserGetUseCase(adminRepository);
    },
    inject: [SQLiteUserRepository],
  },
  {
    provide: UserCreateUseCase,
    useFactory: (adminRepository: IUserRepository, encrypt: IEncrypt) => {
      return new UserCreateUseCase(adminRepository, encrypt);
    },
    inject: [SQLiteUserRepository, EncryptBCrypt],
  },
  {
    provide: UserUpdateUseCase,
    useFactory: (adminRepository: IUserRepository, encrypt: IEncrypt) => {
      return new UserUpdateUseCase(adminRepository, encrypt);
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
];

@Module({
  imports: [TypeORMSettings, JWTSettings],
  controllers: [AppController],
  providers: [
    //ANCHOR: Repository
    SQLiteUserRepository,

    //ANCHOR: Others
    JWTAuthentication,
    EncryptBCryptProvider,
    ...UseCasesProviders,
    AuthGuard,
  ],
})
export class AppModule {}
