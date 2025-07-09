import { Test, TestingModule } from '@nestjs/testing';
import { ActorsService } from './actors.service';
import { ActorRepository } from './repository/actor.repository';
import { CreateActorDto, CreateActorResponseDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Name } from './domain/actor.value-object';
import { Actor } from './domain/actors.domain';
import { ActorException } from './exeptions/actor.exeption';
import { GetAllActorsResponseDto } from './dto/get-all.dto';
import { SingleActorResponseDto } from './dto/single-actor.dto';
import { ActorMapper } from './mappers/actor.mappers';

interface ActorInternalPropsForComparison {
  name: Name;
  lastName: Name;
  movies?: string[];
}

// Mock Actor domain object and its JSON representation for consistent testing
const mockActorId = 'actor-123';
const mockMovieId = 'movie-456';

const mockActorProps = {
  name: new Name('John'),
  lastName: new Name('Doe'),
  movies: [],
};

const mockActorDomain = Actor.create(mockActorProps, mockActorId);
const mockJsonActor = ActorMapper.toJson(mockActorDomain);

// Mock the ActorRepository
const mockActorRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ActorsService', () => {
  let service: ActorsService;
  let repository: typeof mockActorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorsService,
        {
          provide: ActorRepository,
          useValue: mockActorRepository,
        },
      ],
    }).compile();

    service = module.get<ActorsService>(ActorsService);
    repository = module.get<typeof mockActorRepository>(ActorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an actor and return CreateActorResponseDto', async () => {
      const createActorDto: CreateActorDto = {
        name: new Name('Jane'),
        lastName: new Name('Smith'),
        movies: [],
      };

      const createdActorDomain = Actor.create(createActorDto, 'new-actor-id');

      repository.create.mockResolvedValue(createdActorDomain);

      const result = await service.create(createActorDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining<{ props: ActorInternalPropsForComparison }>({
          props: expect.objectContaining<ActorInternalPropsForComparison>({
            name: createActorDto.name,
            lastName: createActorDto.lastName,
            movies: createActorDto.movies,
          }) as ActorInternalPropsForComparison,
        }),
      );
      expect(result).toBeInstanceOf(CreateActorResponseDto);
      expect(result.movie).toEqual(ActorMapper.toJson(createdActorDomain));
    });

    it('should throw ActorException if repository creation fails', async () => {
      const createActorDto: CreateActorDto = {
        name: new Name('Jane'),
        lastName: new Name('Smith'),
        movies: [],
      };
      repository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(createActorDto)).rejects.toThrow(
        ActorException,
      );
      await expect(service.create(createActorDto)).rejects.toThrow(
        'Failed to create actor: DB error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all actors in a GetAllActorsResponseDto', async () => {
      const actors = [
        mockActorDomain,
        Actor.create(
          {
            name: new Name('Another'),
            lastName: new Name('Actor'),
            movies: [],
          },
          'actor-456',
        ),
      ];
      repository.findAll.mockResolvedValue(actors);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(GetAllActorsResponseDto);
      expect(result.actors).toEqual(actors.map(ActorMapper.toJson));
    });

    it('should throw ActorException if repository findAll fails', async () => {
      repository.findAll.mockRejectedValue(new Error('Network error'));

      await expect(service.findAll()).rejects.toThrow(ActorException);
      await expect(service.findAll()).rejects.toThrow(
        'Failed to retrieve actors: Network error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single actor by ID in a SingleActorResponseDto', async () => {
      repository.findById.mockResolvedValue(mockActorDomain);

      const result = await service.findOne(mockActorId);

      expect(repository.findById).toHaveBeenCalledWith(mockActorId);
      expect(result).toBeInstanceOf(SingleActorResponseDto);
      expect(result.actor).toEqual(mockJsonActor);
    });

    it('should throw ActorException if actor not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        ActorException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Actor with ID non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update an actor and return SingleActorResponseDto', async () => {
      const updateActorDto: UpdateActorDto = { name: new Name('Updated John') };

      const updateData: Partial<ActorInternalPropsForComparison> = {};
      if (updateActorDto.name) {
        updateData.name = updateActorDto.name;
      }
      if (updateActorDto.movies) {
        updateData.movies = updateActorDto.movies;
      }
      const updatedActorDomain = Actor.create(
        {
          ...mockActorProps,
          ...updateData,
        },
        mockActorId,
      );
      const updatedJsonActor = ActorMapper.toJson(updatedActorDomain);

      repository.findById.mockResolvedValue(mockActorDomain);
      repository.update.mockResolvedValue(updatedActorDomain);

      const result = await service.update(mockActorId, updateActorDto);

      expect(repository.findById).toHaveBeenCalledWith(mockActorId);

      expect(repository.findById).toHaveBeenCalledWith(mockActorId);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect(repository.update).toHaveBeenCalledWith(
        mockActorId,
        expect.objectContaining<{
          props: Partial<ActorInternalPropsForComparison>;
        }>({
          props: expect.objectContaining<
            Partial<ActorInternalPropsForComparison>
          >({
            name: updateActorDto.name || mockActorProps.name,
            lastName: mockActorProps.lastName,
          }) as ActorInternalPropsForComparison,
        }),
      );
      expect(result).toBeInstanceOf(SingleActorResponseDto);
      expect(result.actor).toEqual(updatedJsonActor);
    });

    it('should throw ActorException if actor to update is not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: new Name('Test') }),
      ).rejects.toThrow(ActorException);
      await expect(
        service.update('non-existent-id', { name: new Name('Test') }),
      ).rejects.toThrow('Actor with ID non-existent-id not found');
    });

    it('should throw ActorException if repository update fails', async () => {
      repository.findById.mockResolvedValue(mockActorDomain);
      repository.update.mockRejectedValue(new Error('Update failed'));

      await expect(
        service.update(mockActorId, { name: new Name('New Name') }),
      ).rejects.toThrow(ActorException);
      await expect(
        service.update(mockActorId, { name: new Name('New Name') }),
      ).rejects.toThrow('Failed to update actor: Update failed');
    });
  });

  describe('addActorToMovie', () => {
    it('should add a movie to an actor and return SingleActorResponseDto', async () => {
      const actorBeforeAdd = Actor.create(
        {
          name: new Name('John'),
          lastName: new Name('Doe'),
          movies: [],
        },
        mockActorId,
      );

      const actorAfterAdd = Actor.create(
        {
          name: new Name('John'),
          lastName: new Name('Doe'),
          movies: [mockMovieId],
        },
        mockActorId,
      );
      const jsonActorAfterAdd = ActorMapper.toJson(actorAfterAdd);

      repository.findById.mockResolvedValue(actorBeforeAdd);
      repository.update.mockResolvedValue(actorAfterAdd);

      const result = await service.addActorToMovie(mockActorId, mockMovieId);

      expect(repository.findById).toHaveBeenCalledWith(mockActorId);
      // No change needed here for movies, as it's already string[]
      expect(repository.update).toHaveBeenCalledWith(
        mockActorId,
        expect.objectContaining<{ props: ActorInternalPropsForComparison }>({
          // Add generic here too
          props: expect.objectContaining<ActorInternalPropsForComparison>({
            // Add generic here too
            name: actorAfterAdd.name, // Ensure Name objects are compared to Name objects
            lastName: actorAfterAdd.lastName,
            movies: [mockMovieId],
          }),
        }),
      );
      expect(result).toBeInstanceOf(SingleActorResponseDto);
      expect(result.actor).toEqual(jsonActorAfterAdd);
    });

    it('should throw ActorException if actor not found for addActorToMovie', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.addActorToMovie('non-existent', mockMovieId),
      ).rejects.toThrow(ActorException);
      await expect(
        service.addActorToMovie('non-existent', mockMovieId),
      ).rejects.toThrow('Actor with ID non-existent not found');
    });
  });
});
