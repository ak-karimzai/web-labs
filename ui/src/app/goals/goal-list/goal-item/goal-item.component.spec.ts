import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalItemComponent } from './goal-item.component';

describe('GoalItemComponent', () => {
  let component: GoalItemComponent;
  let fixture: ComponentFixture<GoalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoalItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
