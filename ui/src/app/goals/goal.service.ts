import {Goal, GoalsPaginator} from "./goal.model";
import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject, Subject, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class GoalService {
    selectedGoalId: BehaviorSubject<number>;
    goalsUpdated: Subject<boolean>;
    private localStorageKey: string = "_goalForm";

    constructor(private http: HttpClient) {
        this.selectedGoalId = new BehaviorSubject<number>(null);
        this.goalsUpdated = new Subject<boolean>();;
    }

    getGoals(pageID: number, pageSize: number) {
        return this.http
            .get<Goal[]>("https://localhost/api/v1/goals/", {
                params: new HttpParams().set("page_id", pageID).set("page_size", pageSize),
            })
            .pipe(catchError(this.handleError))
            .pipe(
              map((response) => ({
                goals: response,
                page: pageID,
                hasMorePages: response.length !== 0
              } as GoalsPaginator))
            );
    }

    getGoalById(id: number) {
        return this.http
            .get<Goal>(`https://localhost/api/v1/goals/${id}`)
            .pipe(catchError(this.handleError));
    }

    updateGoal(goal: Goal) {
        return this.http
            .patch(`https://localhost/api/v1/goals/${goal.id}`, {
                'name': goal.name,
                'description': goal.description,
                'completion_status': goal.completion_status,
                'start_date': this.toApiDate(goal.start_date),
                'target_date': this.toApiDate(goal.target_date)
            })
            .pipe(catchError(this.handleError));
    }

    createGoal(goal: Goal) {
        return this.http
            .post("https://localhost/api/v1/goals/", {
                'name': goal.name,
                'description': goal.description,
                'start_date': this.toApiDate(goal.start_date),
                'target_date': this.toApiDate(goal.target_date)
            })
            .pipe(catchError(this.handleError));
    }

    deleteGoal(id: number) {
        return this.http
            .delete(`https://localhost/api/v1/goals/${id}`)
            .pipe(catchError(this.handleError));
    }

    public toApiDate(date: Date) {
        let d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = d.getFullYear();

        if (day.length < 2)
            day = '0' + day;
        if (month.length < 2)
            month = '0' + month;
        return [day, month, year].join('-');
    }

    private handleError(err: HttpErrorResponse) {
        let errMessage = 'An unknown error occurred!';
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
    completionStatus: string,
    startDate: string,
    targetDate: string})
  {
    localStorage.setItem(this.localStorageKey, JSON.stringify(formData));
  }

  loadFormData(): {name: string,
    description: string,
    completionStatus: string,
    startDate: string,
    targetDate: string} {
    const savedFormData = localStorage.getItem(this.localStorageKey);
    if (savedFormData) {
      return JSON.parse(savedFormData);
    }
    return {name: "",
      description: "",
      completionStatus: "",
      startDate: "",
      targetDate: ""};
  }
}
