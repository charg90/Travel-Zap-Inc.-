import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './domain/user.domain'; // Import the User domain entity
import { HttpException, HttpStatus } from '@nestjs/common';

// --- Mocks ---
// Mock the AuthRepository abstract class
const mockAuthRepository = {
  register: jest.fn(),
  login: jest.fn(),
  findByEmail: jest.fn(),
};

// Mock the JwtService methods
const mockJwtService = {
  sign: jest.fn(),
  verifyAsync: jest.fn(), // Include if you ever test verifyAsync through AuthService
};

// Mock bcrypt's hash method.
// We only need to mock `hash` as `AuthService` doesn't directly call `compare`.
// The comparison logic is expected to be handled by `AuthRepository.login`.
jest.mock('bcrypt', () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  // Ensure other methods are present if bcrypt is used elsewhere, or just omit if not.
  // compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: typeof mockAuthRepository;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<typeof mockAuthRepository>(AuthRepository);
    jwtService = module.get<typeof mockJwtService>(JwtService);

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'plainPassword123',
    };
    const hashedPassword = `hashed_${registerDto.password}`;

    const userDomainInstance = User.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    it('should successfully register a new user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      authRepository.register.mockResolvedValue({
        id: 'user-id-1',
        ...userDomainInstance.props,
      });

      const result = await authService.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(authRepository.register).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          password: hashedPassword,
        }),
      );
      expect(result).toEqual({ id: 'user-id-1', ...userDomainInstance.props });
    });

    it('should throw HttpException (500) if bcrypt hashing fails', async () => {
      const hashingError = new Error('Error during password hashing');
      (bcrypt.hash as jest.Mock).mockRejectedValue(hashingError);

      await expect(authService.register(registerDto)).rejects.toThrow(
        HttpException,
      );
      await expect(authService.register(registerDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      await expect(authService.register(registerDto)).rejects.toHaveProperty(
        'message',
        `Error registering user:${hashingError}`,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(authRepository.register).not.toHaveBeenCalled();
    });

    it('should throw HttpException (500) for other generic errors during registration', async () => {
      const genericError = new Error('Unexpected error during user creation');
      jest.spyOn(User, 'create').mockImplementation(() => {
        throw genericError;
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await expect(authService.register(registerDto)).rejects.toThrow(
        HttpException,
      );
      await expect(authService.register(registerDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      await expect(authService.register(registerDto)).rejects.toHaveProperty(
        'message',
        `Error registering user:${genericError}`,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(authRepository.register).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'existing@example.com',
      password: 'correctPassword',
    };
    const userFromDb = User.create(
      {
        email: loginDto.email,
        password: 'hashedCorrectPassword',
      },
      'user-id-abc',
    );
    const mockedAccessToken = 'mock_jwt_access_token';

    it('should successfully log in a user and return access token', async () => {
      authRepository.findByEmail.mockResolvedValue(userFromDb);
      // Simulate authRepository.login finding the user and matching credentials
      authRepository.login.mockResolvedValue(userFromDb);
      jwtService.sign.mockReturnValue(mockedAccessToken);

      const result = await authService.login(loginDto);

      expect(authRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      // authRepository.login receives a User domain object created from loginDto
      expect(authRepository.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: loginDto.email,
          password: loginDto.password, // Raw password is passed to repo for comparison
        }),
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: userFromDb.email,
        sub: userFromDb.id,
      });
      expect(result).toEqual({
        accessToken: mockedAccessToken,
        user: {
          id: userFromDb.id,
          email: userFromDb.email,
        },
      });
    });

    it('should throw HttpException (404) if user not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null); // Simulate user not found in DB

      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authService.login(loginDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.NOT_FOUND,
      );
      await expect(authService.login(loginDto)).rejects.toHaveProperty(
        'message',
        'User not found',
      );

      expect(authRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(authRepository.login).not.toHaveBeenCalled(); // No login attempt if user not found
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  // --- FindByEmail Method Tests ---
  describe('findByEmail', () => {
    const emailToFind = 'findme@example.com';
    const foundUser = User.create(
      { email: emailToFind, password: 'hashedPass' },
      'user-id-find',
    );

    it('should return a user if found by email', async () => {
      authRepository.findByEmail.mockResolvedValue(foundUser);

      const result = await authService.findByEmail(emailToFind);

      expect(authRepository.findByEmail).toHaveBeenCalledWith(emailToFind);
      expect(result).toEqual(foundUser);
    });

    it('should return null if user not found by email', async () => {
      authRepository.findByEmail.mockResolvedValue(null);

      const result = await authService.findByEmail(emailToFind);

      expect(authRepository.findByEmail).toHaveBeenCalledWith(emailToFind);
      expect(result).toBeNull();
    });
  });
});
