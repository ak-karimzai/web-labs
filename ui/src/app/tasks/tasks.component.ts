import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  goalId: number;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
        .subscribe(
            params => {
              this.goalId = +params.id;
            }
        )
  }
}
