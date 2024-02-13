import { Injectable, OnInit } from "@angular/core";
import {Subject, throwError} from "rxjs";
import {Task, TasksPaginator} from "./task.model";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Goal, GoalsPaginator} from "../goals/goal.model";
import {catchError, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class TaskService implements OnInit {
    tasksUpdated: Subject<boolean> = new Subject();
    private localStorageKey: string = "_taskForm";

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
    }

    updateTask(goalID: number, task: Task) {
        return this.http
            .put(`https://localhost/api/v1/goals/${goalID}/tasks/${task.id}`, {
                'name': task.name,
                'description': task.description,
                'frequency': task.frequency,
            })
            .pipe(catchError(this.handleError));
    }

    createTask(goalID: number, task: Task) {
        return this.http
            .post(`https://localhost/api/v1/goals/${goalID}/tasks`, {
                'name': task.name,
                'description': task.description,
                'frequency': task.frequency
            })
            .pipe(catchError(this.handleError));
    }

    getTaskByID(goalID: number, id: number) {
        return this.http
            .get<Task>(`https://localhost/api/v1/goals/${goalID}/tasks/${id}`)
            .pipe(catchError(this.handleError));
    }

    getTasks(goalId: number, pageID: number, pageSize: number) {
        return this.http
            .get<Task[]>(`https://localhost/api/v1/goals/${goalId}/tasks`, {
                params: new HttpParams().set("page_id", pageID).set("page_size", pageSize),
            })
            .pipe(catchError(this.handleError))
            .pipe(
              map((response) => ({
                tasks: response,
                page: pageID,
                hasMorePages: response.length !== 0
              } as TasksPaginator)));
    }

    deleteTask(goalId: number, taskId: number) {
        return this.http
          .delete<Task>(`https://localhost/api/v1/goals/${goalId}/tasks/${taskId}`)
          .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        let errMessage: string = 'An unknown error occurred!';
        if (!err.status) {
            return throwError(errMessage);
        }

        switch (err.status) {
            case 400:
                errMessage = 'Bad credentials!';
                break;
            case 401:
                errMessage = 'Unauthorized!';
                break;
            case 403:
                errMessage = 'Permission denied!';
                break;
            case 404:
                errMessage = 'Not found!';
                break;
            case 409:
                errMessage = 'Goal with this name already exist!';
                break;
        }
        return throwError(errMessage);
    }

  saveFormData(formData: {name: string,
    description: string,
    frequency: string})
  {
    localStorage.setItem(this.localStorageKey, JSON.stringify(formData));
  }

  loadFormData(): {name: string,
    description: string,
    frequency: string} {
    const savedFormData = localStorage.getItem(this.localStorageKey);
    if (savedFormData) {
      return JSON.parse(savedFormData);
    }
    return {name: "",
      description: "",
      frequency: ""};
  }
}
