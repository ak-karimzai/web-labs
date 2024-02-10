import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {GoalService} from "../goal.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {Goal} from "../goal.model";

@Component({
  selector: 'app-goal-edit',
  templateUrl: './goal-edit.component.html',
  styleUrls: ['./goal-edit.component.css']
})
export class GoalEditComponent implements OnInit, OnDestroy {
  goalForm: FormGroup;
  editMode: boolean = true;
  isLoading: boolean;
  error: string = null;
  id: number;
  private subsription: Subscription;


  constructor(private goalService: GoalService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.subsription = this.route.params
        .subscribe(
            (params: Params) => {
              this.id = +params['id'];
              this.editMode = params['id'] != null;
              this.initForm();
            }
        );
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }

  onCancel() {
    this.router.navigate(["../"], {relativeTo: this.route});
  }

  onSubmit() {
    const formValue = this.goalForm.value;
    const goal = new Goal(
        this.id,
        formValue.name,
        formValue.description,
        formValue.completionStatus,
        formValue.startDate,
        formValue.targetDate,
        null,
        null,
    );

    this.isLoading = true;
    let subs: Observable<any>;
    if (this.editMode) {
        subs = this.goalService.updateGoal(goal);
    } else {
        subs = this.goalService.createGoal(goal);
    }

    subs.subscribe(()=> {
        this.isLoading = false;
        this.router.navigate(['../'], {relativeTo: this.route});
        this.goalService.goalsUpdated.next(true);
    }, error => {
        this.error = error;
        this.isLoading = false;
    })
  }

  private initForm() {
    let goalName: string;
    let goalDescription: string;
    let goalCompletionStatus: string;
    let goalStartDate: string;
    let goalTargetDate: string;

    if (this.editMode) {
      console.log("edit mode");
      this.isLoading = true;
      this.goalService.getGoalById(this.id)
          .subscribe(goal => {
            goalName = goal.name;
            goalDescription = goal.description;
            goalCompletionStatus = goal.completion_status;
            goalStartDate = new Date(goal.start_date).toISOString().slice(0, -14);
            goalTargetDate = new Date(goal.target_date).toISOString().slice(0, -14);
            this.createForm(goalName, goalDescription, goalCompletionStatus, goalStartDate, goalTargetDate);
            this.isLoading = false;
          }, err => {
            this.error = err;
            this.isLoading = false;
          })
    }
    this.createForm(goalName, goalDescription, goalCompletionStatus, goalStartDate, goalTargetDate);
  }

  private createForm(goalName: string, goalDescription: string, goalCompletionStatus: string, goalStartDate: string, goalTargetDate: string) {
    this.goalForm = new FormGroup({
      'name': new FormControl(goalName, Validators.required),
      'description': new FormControl(goalDescription, Validators.required),
      'completionStatus': new FormControl(goalCompletionStatus),
      'startDate': new FormControl(goalStartDate, Validators.required),
      'targetDate': new FormControl(goalTargetDate, Validators.required),
    });
  }

  onHandleError() {
    this.error = null;
  }
}
