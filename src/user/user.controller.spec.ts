import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    register: jest
      .fn()
      .mockResolvedValue({ message: 'User registered successfully' }),
    login: jest.fn().mockResolvedValue({ access_token: 'token', user: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register on userService', async () => {
    const dto = {
      name: 'John',
      email: 'john@example.com',
      password: 'pass123',
    };
    await controller.register(dto);
    expect(mockUserService.register).toHaveBeenCalledWith(dto);
  });

  it('should call login on userService', async () => {
    const dto = { email: 'john@example.com', password: 'pass123' };
    await controller.login(dto);
    expect(mockUserService.login).toHaveBeenCalledWith(dto);
  });
});
