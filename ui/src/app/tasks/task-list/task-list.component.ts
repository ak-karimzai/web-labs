import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Goal, GoalsPaginator} from "../../goals/goal.model";
import {GoalService} from "../../goals/goal.service";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {Task, TasksPaginator} from "../task.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskService} from "../task.service";
import {MatSelect} from "@angular/material/select";
import {catchError, scan, switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  public goalsPaginator$: Observable<GoalsPaginator>;
  public tasksPaginator$: Observable<TasksPaginator>;

  public loading$ = new BehaviorSubject<boolean>(true);
  private goalPage$ = new BehaviorSubject<number>(1);
  private taskPage$ = new BehaviorSubject<number>(1);
  private pageSize = 12;

  private querySubscription: Subscription;
  private updateSubscription: Subscription;

  protected goalID: number;


  constructor(
    private goalService: GoalService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.goalsPaginator$ = this.loadGoals();

    this.querySubscription = this.route.queryParams
      .subscribe(
        params => {
          this.goalID = +params['goal_id'];
          if (this.goalID) {
            // this.tasks.next([]);
            this.tasksPaginator$ = this.loadTasks();
          } else {
            // this.isLoading = false;
          }
        }
      );

    this.updateSubscription = this.taskService
      .tasksUpdated.subscribe(
        () => {
          this.taskPage$.next(1);
          this.tasksPaginator$ = this.loadTasks();
        }
      )
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }

  private loadGoals(): Observable<GoalsPaginator> {
    return this.goalPage$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.goalService.getGoals(page, 7)),
      scan(this.updateGoalsPaginator, {goals: [], page: 0, hasMorePages: true} as GoalsPaginator),
      tap(() => this.loading$.next(false)),
      catchError(err => of({
        error: err
      } as GoalsPaginator))
    );
  }

  private updateGoalsPaginator(accumulator: GoalsPaginator, value: GoalsPaginator): GoalsPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.goals.push(...value.goals);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreGoals(paginator: GoalsPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.goalPage$.next(paginator.page + 1);
  }

  private loadTasks(): Observable<TasksPaginator> {
    return this.taskPage$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.taskService.getTasks(this.goalID, page, this.pageSize)),
      scan(this.updateTasksPaginator, {tasks: [], page: 0, hasMorePages: true} as TasksPaginator),
      tap(() => this.loading$.next(false)),
      catchError(err => of({
        error: err
      } as TasksPaginator))
    );
  }

  private updateTasksPaginator(accumulator: TasksPaginator, value: TasksPaginator): TasksPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.tasks.push(...value.tasks);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreTasks(paginator: TasksPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.taskPage$.next(paginator.page + 1);
  }

  onNewTask() {
    this.router.navigate(['new'], {relativeTo: this.route, queryParams: { goal_id: this.goalID }});
  }

  onHandleError(paginator: { error?: string }): void {
    paginator.error = null;
  }

  onGoalChange(selectedGoalId: string) {
    this.goalID = +selectedGoalId;
    this.router.navigate(['/tasks' ], { queryParams: { goal_id: this.goalID }});
  }
}
