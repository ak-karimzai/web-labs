import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import {AuthComponent} from "./auth/auth.component";
import {LoadingSpinnerComponent} from "./shared/loading-spinner/loading-spinner.component";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskEditComponent } from './tasks/task-edit/task-edit.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';
import { GoalEditComponent } from './goals/goal-edit/goal-edit.component';
import { GoalDetailComponent } from './goals/goal-detail/goal-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GoalItemComponent } from './goals/goal-list/goal-item/goal-item.component';
import { TaskItemComponent } from './tasks/task-list/task-item/task-item.component';
import {AlertComponent} from "./alert/alert.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { MatSelectModule} from "@angular/material/select";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from "@angular/material/core";
import {MatSelectInfiniteScrollModule} from "ng-mat-select-infinite-scroll";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    AuthComponent,
    LoadingSpinnerComponent,
    TaskListComponent,
    TaskEditComponent,
    TaskDetailComponent,
    GoalListComponent,
    GoalEditComponent,
    GoalDetailComponent,
    NotFoundComponent,
    GoalItemComponent,
    TaskItemComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InfiniteScrollModule,
    MatOptionModule,
    MatSelectModule,
    MatSelectInfiniteScrollModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
