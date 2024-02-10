import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";
import {Router} from "@angular/router";
import {User} from "./user.mode";

export interface AuthResponse {
  message: string;
}

export interface LoginResponseData {
  token: string;
  userInfo: {
    firstName: string,
    lastName: string,
    username: string,
    createdAt: Date,
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(firstName: string, lastName: string, username: string, password: string) {
    return this.http
      .post<AuthResponse>("https://localhost/api/v1/auth/signup", {
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'password': password,
      })
      .pipe(catchError(this.handleError));
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponseData>("https://localhost/api/v1/auth/login", {
        username: username,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap(resData =>
          this.handleAuthentication(
            resData.token,
            resData.userInfo))
      );
  }

  autoLogin() {
    const userData: {
      token: string,
      userInfo: {
        firstName: string,
        lastName: string,
        username: string,
        createdAt: Date
        }
    }  = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }

    const user = new User(
      userData.token,
      userData.userInfo);
    this.user.next(user);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
  }

  private handleAuthentication(email: string,
                               userInfo: {
                                          firstName: string,
                                          lastName: string,
                                          username: string,
                                          createdAt: Date
  }) {
    const user: User = new User(email, userInfo);
    this.user.next(user);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  private handleError(errRes: HttpErrorResponse) {
    console.log(errRes);
    let errMessage = 'An unknown error occurred!';
    if (!errRes.status) {
      return throwError(errMessage);
    }

    switch (errRes.status) {
      case 400:
        errMessage = 'Bad credentials!';
        break;
      case 404:
        errMessage = 'Bad credentials!';
        break;
      case 409:
        errMessage = 'Username already exists';
        break;
    }
    return throwError(errMessage);
  }
}
