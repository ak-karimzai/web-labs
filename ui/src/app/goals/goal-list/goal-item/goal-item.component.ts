import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Goal } from "../../goal.model";

@Component({
  selector: 'app-goal-item',
  templateUrl: './goal-item.component.html',
  styleUrls: ['./goal-item.component.css']
})
export class GoalItemComponent implements OnInit {
  @Input() goal: Goal;
  @Output() loaded = new EventEmitter<number>();

  ngOnInit() {
    this.loaded.emit(this.goal.id);
  }
}
