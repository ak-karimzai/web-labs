import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";
import {NotFoundComponent} from "./not-found/not-found.component";
import {TaskEditComponent} from "./tasks/task-edit/task-edit.component";
import {TaskDetailComponent} from "./tasks/task-detail/task-detail.component";
import {GoalEditComponent} from "./goals/goal-edit/goal-edit.component";
import {GoalDetailComponent} from "./goals/goal-detail/goal-detail.component";
import {TaskListComponent} from "./tasks/task-list/task-list.component";
import {GoalListComponent} from "./goals/goal-list/goal-list.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/goals', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard],
    children: [
      { path: 'new', component: TaskEditComponent },
      { path: ':id', component: TaskDetailComponent },
      { path: ':id/edit', component: TaskEditComponent },
    ] },
  { path: 'goals', component: GoalListComponent, canActivate: [AuthGuard],
    children: [
      { path: 'new', component: GoalEditComponent },
      { path: ':id', component: GoalDetailComponent },
      { path: ':id/edit', component: GoalEditComponent },
    ] },
  { path: 'auth', component: AuthComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
