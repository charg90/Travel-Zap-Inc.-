import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Mock the AuthService
  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Provide the mock service
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return the result', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        accessToken: 'jwt_token',
        user: { id: '1', email: 'test@example.com' },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException if authService.login throws HttpException (e.g., user not found)', async () => {
      const loginDto: LoginDto = {
        email: 'notfound@example.com',
        password: 'password123',
      };
      const httpException = new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );

      mockAuthService.login.mockRejectedValue(httpException);

      await expect(authController.login(loginDto)).rejects.toThrow(
        httpException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw HttpException if authService.login throws HttpException (e.g., invalid credentials)', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const httpException = new HttpException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );

      mockAuthService.login.mockRejectedValue(httpException);

      await expect(authController.login(loginDto)).rejects.toThrow(
        httpException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw HttpException for generic errors during registration', async () => {
      const registerDto: RegisterDto = {
        email: 'error@example.com',
        password: 'password123',
      };
      const genericError = new Error('Database insertion failed');

      const expectedAuthServiceErrorMessage = `Error registering user:${genericError}`;
      const expectedHttpExceptionFromService = new HttpException(
        expectedAuthServiceErrorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      // Mock authService.register to reject with the HttpException that
      // AuthService itself would produce after catching a generic error.
      mockAuthService.register.mockRejectedValue(
        expectedHttpExceptionFromService,
      );

      await expect(authController.register(registerDto)).rejects.toThrow(
        expectedHttpExceptionFromService, // Expect the specific HttpException instance
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('register', () => {
    it('should call authService.register and return success message with user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'newpassword',
      };
      const registeredUser = { id: '2', email: 'newuser@example.com' };
      const expectedResponse = {
        message: 'User registered successfully',
        user: registeredUser,
      };

      mockAuthService.register.mockResolvedValue(registeredUser);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw HttpException if authService.register throws HttpException', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
      };
      const httpException = new HttpException(
        'User already exists',
        HttpStatus.CONFLICT,
      );

      mockAuthService.register.mockRejectedValue(httpException);

      await expect(authController.register(registerDto)).rejects.toThrow(
        httpException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw HttpException for generic errors during registration', async () => {
      const registerDto: RegisterDto = {
        email: 'error@example.com',
        password: 'password123',
      };
      const serviceThrownError = new Error('Database insertion failed');
      const expectedHttpExceptionFromService = new HttpException(
        `Error registering user:${serviceThrownError}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      mockAuthService.register.mockRejectedValue(
        expectedHttpExceptionFromService,
      );

      await expect(authController.register(registerDto)).rejects.toThrow(
        expectedHttpExceptionFromService,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
