import {Component, OnDestroy, OnInit} from '@angular/core';
import {Goal} from "../../goals/goal.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {GoalService} from "../../goals/goal.service";
import {TaskService} from "../task.service";
import {Task} from "../task.model";
import {Subscription} from "rxjs";
import {relative} from "@angular/compiler-cli";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  task: Task;
  isLoading: boolean;
  error: string;
  goalId: number;
  taskId: number;
  private subscription: Subscription;
  private querySubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private goalService: GoalService, private taskService: TaskService) {
  }

  ngOnInit() {
    this.subscription = this.route.params
        .subscribe(
            (params: Params) => {
              this.taskId = +params['id'];
              this.querySubscription = this.route.queryParams
                .subscribe(
                  params => {
                    this.goalId = +params['goal_id'];
                    this.fetchTask(this.goalId, this.taskId);
                  }
                );
            }
        );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.querySubscription.unsubscribe();
  }

  private fetchTask(goalId: number, taskId: number) {
    this.isLoading = true;
    this.taskService.getTaskByID(goalId, taskId)
        .subscribe(
            task => {
              this.task = task;
              this.isLoading = false;
            }, error => {
              this.error = error;
              this.isLoading = false;
          }
        )
  }

  onEditTask() {
    this.router.navigate(["/tasks", this.task.id, "edit"], {queryParams: {goal_id: this.goalId}});
  }

  onDeleteTask() {
    this.isLoading = true;
    this.taskService.deleteTask(this.goalId, this.taskId)
      .subscribe(
        () => {
          this.isLoading = false;
          this.taskService.tasksUpdated.next(true);
        }, error => {
          this.error = error;
          this.isLoading = true;
        }
      );
  }

  onHandleError() {
    this.error = null;
  }
}
