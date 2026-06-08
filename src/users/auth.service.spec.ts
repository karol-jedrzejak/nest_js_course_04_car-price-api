import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException,NotFoundException } from "@nestjs/common";


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {

        // fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
        };

        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
        }).compile();

        service = module.get(AuthService);
    });


    it('should create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('should create a new user with a salted and hashed password', async () => {
        const user = await service.signup('test@example.com', 'password');
        expect(user.password).not.toEqual('password');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
        expect(user).toBeDefined();
    });

    it('should throw an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'kj@gmail.com', password: 'hashed_password' } as User]);
        await expect(service.signup('kj@gmail.com', 'dupadupa')).rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
    });


});