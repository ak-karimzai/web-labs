import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { GoalService } from '../goal.service';
import { ActivatedRoute, Router } from '@angular/router';
import {BehaviorSubject, EMPTY, Observable, of, Subject, Subscription, throwError} from 'rxjs';
import {GoalsPaginator} from "../goal.model";
import {catchError, finalize, scan, switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit, OnDestroy {
  public goalsPaginator$: Observable<GoalsPaginator>;

  public loading$ = new BehaviorSubject<boolean>(true);
  private page$ = new BehaviorSubject<number>(1);
  private pageSize = 10;
  private subscription: Subscription;

  constructor(
    private goalService: GoalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.goalsPaginator$ = this.loadGoals();
    this.subscription = this.goalService.goalsUpdated
      .subscribe(() => {
        this.page$.next(1);
        this.goalsPaginator$ = this.loadGoals();
      });
  }

  private loadGoals(): Observable<GoalsPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.goalService.getGoals(page, this.pageSize)),
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
    this.page$.next(paginator.page + 1);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNewGoal(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onHandleError(paginator: GoalsPaginator): void {
    paginator.error = null;
  }
}
