import {Component, OnInit} from '@angular/core';
import {Goal} from "../goal.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {GoalService} from "../goal.service";

@Component({
  selector: 'app-goal-detail',
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.css']
})
export class GoalDetailComponent implements OnInit {
  goal: Goal;
  isLoading: boolean;
  error: string = null;

  constructor(private router: Router, private route: ActivatedRoute, private goalService: GoalService) {
  }

  ngOnInit() {
      this.isLoading = true;
      this.route.params
          .subscribe(
            (params: Params) => {
                const id = +params['id'];
                this.fetchGoal(id);
            }
        );
  }

  onEditGoal() {
    this.router.navigate(["/goals", this.goal.id, "edit"]);
  }

  onDeleteGoal() {
      this.isLoading = true;
      this.goalService.deleteGoal(this.goal.id).subscribe(
          () => {
              this.isLoading = false;
              this.goalService.goalsUpdated.next(true);
          }, error => {
              this.error = error;
              this.router.navigate(["../" ], {relativeTo: this.route});
              this.isLoading = false;
          }
      )
  }

    private fetchGoal(id: number) {
        this.goalService.getGoalById(id)
            .subscribe(goal => {
                this.goal = goal;
                this.error = null;
                this.isLoading = false;
            }, error => {
                this.error = error;
                this.isLoading = false;
            })
    }

  onHandleError() {
    this.error = null;
  }

  onClose() {
    this.router.navigate(["../"], {relativeTo: this.route})
  }
}
