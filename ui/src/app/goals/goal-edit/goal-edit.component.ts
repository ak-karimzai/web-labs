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
    this.saveFromData();
    this.subsription.unsubscribe();
  }

  onCancel() {
    this.goalForm.reset();
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
        this.goalForm.reset();
        this.saveFromData();
    }, error => {
        this.error = error;
        this.isLoading = false;
    })
  }

  private initForm() {
    const storedFormData = this.goalService.loadFormData();
    if (this.editMode) {
      this.isLoading = true;
      this.goalService.getGoalById(this.id)
          .subscribe(goal => {
            storedFormData.name = goal.name;
            storedFormData.description = goal.description;
            storedFormData.completionStatus = goal.completion_status;
            storedFormData.startDate = new Date(goal.start_date).toISOString().slice(0, -14);
            storedFormData.targetDate = new Date(goal.target_date).toISOString().slice(0, -14);
            this.createForm(storedFormData);
            this.isLoading = false;
          }, err => {
            this.error = err;
            this.isLoading = false;
          })
    }
    this.createForm(storedFormData);
  }

  private createForm(formData: { name: string,
    description: string,
    completionStatus: string,
    startDate: string,
    targetDate: string}) {
    this.goalForm = new FormGroup({
      'name': new FormControl(formData.name, Validators.required),
      'description': new FormControl(formData.description, Validators.required),
      'completionStatus': new FormControl(formData.completionStatus),
      'startDate': new FormControl(formData.startDate, Validators.required),
      'targetDate': new FormControl(formData.targetDate, Validators.required),
    });
  }

  onHandleError() {
    this.error = null;
  }

  private saveFromData() {
    const formData = this.goalForm.value;
    this.goalService.saveFormData(formData);
  }

  onClose() {
    if (this.editMode) this.goalForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
