import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { mockCreateUserDto, mockUser, mockUsersRepository } from '@mocks';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a user', () => {
    it('should should save user to db and return it', async () => {
      mockUsersRepository.create.mockReturnValue(mockUser);
      expect(await service.create(mockCreateUserDto)).toEqual(mockUser);
    });
  });

  describe('when getting user by email', () => {
    it('should return user', async () => {
      mockUsersRepository.findByCondition.mockResolvedValue(mockUser);
      expect(await service.getByEmailOrThrow(mockUser.email)).toEqual(mockUser);
    });

    it('should throw if something went wrong', async () => {
      mockUsersRepository.findByCondition.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(service.getByEmailOrThrow(mockUser.email)).rejects.toThrow();
    });
  });
});
