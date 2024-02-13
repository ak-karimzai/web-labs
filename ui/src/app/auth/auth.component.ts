import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthResponse, AuthService, LoginResponseData} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  public isLoginMode: boolean = true;
  public isLoading: boolean = false;
  public error: string = null;
  public formData: {
    firstName: string,
    lastName: string,
    username: string,
    password: string
  };

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.formData = this.authService.loadFormData();
  }

  ngOnDestroy() {
    this.authService.saveFormData(this.formData);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    if (this.isLoginMode) {
      this.authService.login(this.formData.username, this.formData.password).subscribe(
          () => {
            this.isLoading = false;
            this.router.navigate(['/goals']);
          }, err => {
            this.error = err;
            this.isLoading = false;
          }
      )
    } else {
      this.authService.signup(this.formData)
          .subscribe(() => {
                this.isLoading = false;
              },
              errRes => {
                this.error = errRes;
                this.isLoading = false;
              });
    }

    authForm.reset();

    this.authService.saveFormData(this.formData);
  }

  onHandleError() {
    this.error = null;
  }
}
