import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStartComponent } from './task-start.component';

describe('TaskStartComponent', () => {
  let component: TaskStartComponent;
  let fixture: ComponentFixture<TaskStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
