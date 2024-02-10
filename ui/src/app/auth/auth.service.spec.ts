import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, AuthResponse, LoginResponseData } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem('userData');
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should sign up successfully', () => {
    const mockResponse: AuthResponse = { message: 'User signed up successfully' };
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password'
    };

    authService.signup(mockUserData.firstName, mockUserData.lastName, mockUserData.username, mockUserData.password)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne('https://localhost/api/v1/auth/signup');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should handle signup failure', () => {
    const mockErrorResponse = { status: 409, statusText: 'Conflict' };
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password'
    };

    authService.signup(mockUserData.firstName, mockUserData.lastName, mockUserData.username, mockUserData.password)
      .subscribe(
        () => {},
        error => {
          expect(error).toEqual('Username already exists');
        }
      );

    const req = httpTestingController.expectOne('https://localhost/api/v1/auth/signup');
    req.flush(null, mockErrorResponse);
  });

  it('should login successfully', () => {
    const mockResponse: LoginResponseData = {
      token: 'mockToken',
      userInfo: {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        createdAt: new Date()
      }
    };
    const mockUserData = {
      username: 'johndoe',
      password: 'password'
    };

    authService.login(mockUserData.username, mockUserData.password)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('userData')).toBeTruthy();
      });

    const req = httpTestingController.expectOne('https://localhost/api/v1/auth/login');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });


  it('should handle errors properly', () => {
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

    authService.signup('John', 'Doe', 'johndoe', 'password')
      .subscribe(
        () => {},
        error => {
          expect(error).toEqual('Bad credentials!');
        }
      );

    const req = httpTestingController.expectOne('https://localhost/api/v1/auth/signup');
    req.flush(null, mockErrorResponse);
  });
});

