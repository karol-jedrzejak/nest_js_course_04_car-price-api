import { BadRequestException,NotFoundException } from "@nestjs/common";

import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {

        const users: User[] = [];
        // fake copy of the users service
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter((user) => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                 const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
        };

        const module = await Test.createTestingModule({
        providers: [
            AuthService,
            {
            provide: UsersService,
            useValue: fakeUsersService,
            },
        ],
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
/*         fakeUsersService.find = (email: string) =>
            Promise.resolve(
                email === 'kj@gmail.com'
                    ? [{ id: 1, email, password: 'hashed_password' } as User]
                    : []
            ); */
        await service.signup('kj@gmail.com', 'test');
        await expect(service.signup('kj@gmail.com', 'test2')).rejects.toThrow(BadRequestException);
    });



    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('kj@gmail.com', 'passdflkj')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('kj@gmail.com', 'test');
        /*         fakeUsersService.find = (email: string) =>
            Promise.resolve(
                email === 'kj@gmail.com'
                    ? [{ id: 1, email, password: 'hashed_password' } as User]
                    : []
            ); */
        await expect(service.signin('kj@gmail.com', 'wrongpassword')).rejects.toThrow(NotFoundException);
    }); 

    it('returns a user if correct password is provided', async () => {

        /*  // To Generate hash for test
        const test_user = await service.signup('kj@gmail.com', 'test');
        console.log(test_user)
        */;
        //fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'kj@gmail.com', password: 'f1103e087b1964ad.97d8c6579d7fad3b435ce7f5db3f6cd3a6e64261112c8181fc47a7bb8ec81867' } as User]);
        
        await service.signup('kj@gmail.com', 'test');
       
        const user = await service.signin('kj@gmail.com', 'test');
        expect(user).toBeDefined();
    });




});