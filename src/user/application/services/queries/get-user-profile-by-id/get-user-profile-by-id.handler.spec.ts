import { Test, TestingModule } from '@nestjs/testing';
import { GetUserDataByIdHandler } from './get-user-profile-by-id.handler';
import { UserRedisRepository } from '../../../../domain/services/repositories';
import { UserRedisFactory } from '../../../../../user/domain/services/factories';
import { UserKeyManagerUtility } from '../../utilities';
import { GetUserDataByIdQuery } from './get-user-profile-by-id.query';
import { faker } from '@faker-js/faker';

describe('GetUserDataByIdHandler', () => {
  let handler: GetUserDataByIdHandler;
  let userRedisRepository: UserRedisRepository;
  let userRedisFactory: UserRedisFactory;
  let userKeyManagerUtility: UserKeyManagerUtility;

  const mockUserRedisRepository = {
    IsExist: jest.fn(),
    Find: jest.fn(),
  };

  const mockUserRedisFactory = {
    Upsert: jest.fn(),
  };

  const mockUserKeyManagerUtility = {
    GetUserKey: jest.fn((userId) => `user:cache:${userId}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserDataByIdHandler,
        { provide: UserRedisRepository, useValue: mockUserRedisRepository },
        { provide: UserRedisFactory, useValue: mockUserRedisFactory },
        { provide: UserKeyManagerUtility, useValue: mockUserKeyManagerUtility },
      ],
    }).compile();

    handler = module.get<GetUserDataByIdHandler>(GetUserDataByIdHandler);
    userRedisRepository = module.get<UserRedisRepository>(UserRedisRepository);
    userRedisFactory = module.get<UserRedisFactory>(UserRedisFactory);
    userKeyManagerUtility = module.get<UserKeyManagerUtility>(UserKeyManagerUtility);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and cache a random user if user does not exist', async () => {
    const userId = '123';
    const query = new GetUserDataByIdQuery(userId, 'ENGLISH');
    const randomUser = {
      userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.person.sex(),
      bio: faker.lorem.sentence(),
      jobTitle: faker.person.jobTitle(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      streetAddress: faker.location.streetAddress(),
    };
  
    mockUserRedisRepository.IsExist.mockResolvedValue(false);
    mockUserRedisFactory.Upsert.mockResolvedValue(undefined);
    
    const originalCreateRandomUser = handler['createRandomUser'];
    handler['createRandomUser'] = jest.fn().mockReturnValue(randomUser);
  
    const result = await handler.execute(query); // Ensure to await the result
  
    expect(mockUserRedisRepository.IsExist).toHaveBeenCalledWith(`user:cache:${userId}`);
    expect(handler['createRandomUser']).toHaveBeenCalledWith(userId);
    expect(mockUserRedisFactory.Upsert).toHaveBeenCalledWith(`user:cache:${userId}`, randomUser, expect.any(Number));
    
    // Instead of using GetUserDataMap.item(randomUser), directly compare with randomUser
    expect(result).toEqual(randomUser); // Compare the result with the expected randomUser
  
    handler['createRandomUser'] = originalCreateRandomUser;
  });
  
  it('should find and return existing user if user exists', async () => {
    const userId = '123';
    const query = new GetUserDataByIdQuery(userId, 'ENGLISH');
    const existingUser = {
      userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.person.sex(),
      bio: faker.lorem.sentence(),
      jobTitle: faker.person.jobTitle(),
      avatar: faker.image.avatar(),
      phone: faker.phone.number(),
      streetAddress: faker.location.streetAddress(),
    };
  
    mockUserRedisRepository.IsExist.mockResolvedValue(true);
    mockUserRedisRepository.Find.mockResolvedValue(existingUser);
  
    const result = await handler.execute(query);
  
    expect(mockUserRedisRepository.IsExist).toHaveBeenCalledWith(`user:cache:${userId}`);
    expect(mockUserRedisRepository.Find).toHaveBeenCalledWith(`user:cache:${userId}`);
    
    // Compare the result with the existingUser
    expect(result).toEqual(existingUser); // Direct comparison with the existingUser
  });  
});
