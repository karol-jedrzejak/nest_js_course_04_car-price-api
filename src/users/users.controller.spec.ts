import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {

    fakeUsersService = {
        find: (email: string) => {
            return Promise.resolve([{ id: 1, email: email, password: 'test' } as User]);
        },
        findOne: (id: number) => {
            return Promise.resolve({ id: id, email: 'kj@gmail.pl', password: 'test' } as User);
        },
/*         remove: (id: number) => {
            return Promise.resolve({ id: id, email: 'kj@gmail.pl' } as User);
        },
        update: (id: number, attrs: Partial<User>) => {
            return Promise.resolve({ id: id, email: 'kj@gmail.pl', ...attrs } as User);
        } */
    };

    fakeAuthService = {
/*         signup: (email: string, password: string) => {
            return Promise.resolve({ id: 1, email, password } as User);
        }, */
        signin: (email: string, password: string) => {
            return Promise.resolve({ id: 1, email, password } as User);
        },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },{
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],      
  }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('kj@gmail.pl');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('kj@gmail.pl');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = (id: number) => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = {userId: 10};
    const user = await controller.signin({ email: 'kj@gmail.pl', password: 'test' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
    expect(user).toBeDefined();
  });

});
