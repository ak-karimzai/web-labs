import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalStartComponent } from './goal-start.component';

describe('GoalStartComponent', () => {
  let component: GoalStartComponent;
  let fixture: ComponentFixture<GoalStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoalStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
