import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import {Task} from "./task.model";

describe('TaskService', () => {
  let taskService: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    taskService = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(taskService).toBeTruthy();
  });

  it('should update task successfully', () => {
    const mockGoalId = 1;
    const mockTask: Task = { id: 1, name: 'Task 1', description: 'Description', frequency: 'Weekly' };

    taskService.updateTask(mockGoalId, mockTask).subscribe(
      updatedTask => {
        expect(updatedTask).toEqual(mockTask);
      },
      fail
    );

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${mockGoalId}/tasks/${mockTask.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockTask);
  });

  it('should handle update task error', () => {
    const mockGoalId = 1;
    const mockTask: Task = { id: 1, name: 'Task 1', description: 'Description', frequency: 'Weekly' };

    taskService.updateTask(mockGoalId, mockTask).subscribe(
      () => {},
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${mockGoalId}/tasks/${mockTask.id}`);
    req.error(new ErrorEvent('ERROR'));
  });

});
