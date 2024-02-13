import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  goalId: number = 0;
  isAuthenticated: boolean = false;
  isNavbarCollapsed: boolean = false;
  private userSub: Subscription;

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed; // Toggle the collapse state of the navbar
  }

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.goalId = params['id'];
      if (typeof this.goalId === 'undefined') this.goalId = 0;
    });
  }

  ngOnInit() {
    this.userSub = this.authService.user
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy() {
    this.userSub
      .unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
