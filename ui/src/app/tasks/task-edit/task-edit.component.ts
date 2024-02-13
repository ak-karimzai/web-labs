import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {GoalService} from "../../goals/goal.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Goal} from "../../goals/goal.model";
import {TaskService} from "../task.service";
import {Task} from "../task.model";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  editMode: boolean = true;
  error: string = null;
  id: number;
  isLoading: boolean;
  private subsription: Subscription;
  private querySubscription: Subscription;
  private goalID: number;


  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.subsription = this.route.params
        .subscribe(
            (params: Params) => {
              this.id = +params['id'];
              this.editMode = params['id'] != null;
              this.querySubscription = this.route.queryParams
                .subscribe(
                  params => {
                    this.goalID = +params['goal_id'];
                    this.initForm();
                  }
                );
            }
        );
  }

  ngOnDestroy() {
      this.saveFormData();
      this.subsription.unsubscribe();
      this.querySubscription.unsubscribe();
  }

  onCancel() {
      this.taskForm.reset();
      this.router.navigate(["../"], {relativeTo: this.route, queryParams: {goal_id: this.goalID}});
  }

  onSubmit() {
    const formValue = this.taskForm.value;
    const task = new Task(
        this.id,
        formValue.name,
        formValue.description,
        formValue.frequency,
        null,
        null,
    );

    let subs: Observable<any>;
    if (this.editMode) {
      subs = this.taskService.updateTask(this.goalID, task);
    } else {
      subs = this.taskService.createTask(this.goalID, task);
    }

    subs.subscribe(() => {
        this.taskService.tasksUpdated.next(true);
        this.taskForm.reset();
        this.onClose();
    }, error => {
        this.error = error;
    })
  }

  private initForm() {
    const storedTask = this.taskService.loadFormData();

    if (this.editMode) {
       this.taskService.getTaskByID(this.goalID, this.id)
          .subscribe(task => {
            storedTask.name = task.name;
            storedTask.description = task.description;
            storedTask.frequency = task.frequency;
            this.createForm(storedTask);
          }, error => {
            this.error = error;
            this.isLoading = true;
          });
    }
    this.createForm(storedTask);
  }
  private createForm(formData: {name: string, description: string, frequency: string}) {
    this.taskForm = new FormGroup({
      'name': new FormControl(formData.name, Validators.required),
      'description': new FormControl(formData.description, Validators.required),
      'frequency': new FormControl(formData.frequency, Validators.required),
    });
  }

  onHandleError() {
    this.error = null;
  }

  private saveFormData() {
    const formData = this.taskForm.value;
    this.taskService.saveFormData(formData);
  }

  onClose() {
    if (this.editMode) this.taskForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route, queryParams: {goal_id: this.goalID}});
  }
}
