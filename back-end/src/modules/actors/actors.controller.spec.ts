import { Test, TestingModule } from '@nestjs/testing';
import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';
import { CreateActorDto, CreateActorResponseDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Name } from './domain/actor.value-object';
import { Actor } from './domain/actors.domain';
import { SingleActorResponseDto } from './dto/single-actor.dto';
import { GetAllActorsResponseDto } from './dto/get-all.dto';
import { ActorMapper } from './mappers/actor.mappers';

// Mock Actor domain object for consistent test data
const mockActorDomain = Actor.create(
  {
    name: new Name('John'),
    lastName: new Name('Doe'),
    movies: [],
  },
  '1',
);

// Mock JSON representation of the actor
const mockJsonActor = ActorMapper.toJson(mockActorDomain);

const mockActorsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addActorToMovie: jest.fn(),
};

describe('ActorsController', () => {
  let controller: ActorsController;
  let service: typeof mockActorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActorsController],
      providers: [
        {
          provide: ActorsService,
          useValue: mockActorsService,
        },
      ],
    }).compile();

    controller = module.get<ActorsController>(ActorsController);
    service = mockActorsService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an actor and return a CreateActorResponseDto', async () => {
      const dto: CreateActorDto = {
        name: new Name('John'),
        lastName: new Name('Doe'),
        movies: [],
      };

      const createResponseDto = new CreateActorResponseDto(mockActorDomain);
      service.create.mockResolvedValue(createResponseDto);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createResponseDto);
      expect(result.movie).toEqual(mockJsonActor);
    });
  });

  describe('findAll', () => {
    it('should return an array of actors within a GetAllActorsResponseDto', async () => {
      const actors = [mockActorDomain];
      const getAllResponseDto = new GetAllActorsResponseDto(actors);

      service.findAll.mockResolvedValue(getAllResponseDto);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(getAllResponseDto);
      expect(result.actors).toEqual([mockJsonActor]);
    });
  });

  describe('findOne', () => {
    it('should return a single actor by id within a SingleActorResponseDto', async () => {
      const singleActorResponseDto = new SingleActorResponseDto(
        mockActorDomain,
      );

      service.findOne.mockResolvedValue(singleActorResponseDto);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(singleActorResponseDto);
      expect(result.actor).toEqual(mockJsonActor);
    });

    it('should throw an error if actor is not found', async () => {
      service.findOne.mockRejectedValue(new Error('Actor with ID 2 not found'));

      await expect(controller.findOne('2')).rejects.toThrow(
        'Actor with ID 2 not found',
      );
      expect(service.findOne).toHaveBeenCalledWith('2');
    });
  });

  describe('update', () => {
    it('should update and return the actor within a SingleActorResponseDto', async () => {
      const dto: UpdateActorDto = { name: new Name('Updated Name') };
      const updatedActorDomain = Actor.create(
        {
          name: new Name('Updated Name'),
          lastName: new Name('Doe'),
          movies: [],
        },
        '1',
      );
      const updatedJsonActor = ActorMapper.toJson(updatedActorDomain);
      const singleActorResponseDto = new SingleActorResponseDto(
        updatedActorDomain,
      );

      service.update.mockResolvedValue(singleActorResponseDto);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(singleActorResponseDto);
      expect(result.actor).toEqual(updatedJsonActor);
    });
  });

  describe('remove', () => {
    it('should remove the actor and return a success message', async () => {
      service.remove.mockResolvedValue({
        message: 'Actor with ID 1 deleted successfully',
      });

      // For the specific line:
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Actor with ID 1 deleted successfully',
      });
    });
  });

  describe('addActorToMovie', () => {
    it('should add a movie to an actor and return the updated actor within a SingleActorResponseDto', async () => {
      const actorWithMovieDomain = Actor.create(
        {
          name: new Name('John'),
          lastName: new Name('Doe'),
          movies: ['movieId'],
        },
        '1',
      );
      const actorWithMovieJson = ActorMapper.toJson(actorWithMovieDomain);
      const singleActorResponseDto = new SingleActorResponseDto(
        actorWithMovieDomain,
      );

      service.addActorToMovie.mockResolvedValue(singleActorResponseDto);

      const result = await controller.addActorToMovie('1', 'movieId');

      expect(service.addActorToMovie).toHaveBeenCalledWith('1', 'movieId');
      expect(result).toEqual(singleActorResponseDto);
      expect(result.actor).toEqual(actorWithMovieJson);
    });
  });
});
