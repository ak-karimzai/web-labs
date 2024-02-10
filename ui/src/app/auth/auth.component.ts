import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponse, AuthService, LoginResponseData} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }
    const firstName = authForm.value.firstName;
    const lastName = authForm.value.lastName;
    const username = authForm.value.username;
    const password = authForm.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.authService.login(username, password).subscribe(
          () => {
            this.isLoading = false;
            this.router.navigate(['/goals']);
          }, err => {
            this.error = err;
            this.isLoading = false;
          }
      )
    } else {
      this.authService.signup(firstName, lastName, username, password)
          .subscribe(() => {
                this.isLoading = false;
              },
              errRes => {
                this.error = errRes;
                this.isLoading = false;
              });
    }

    authForm.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
