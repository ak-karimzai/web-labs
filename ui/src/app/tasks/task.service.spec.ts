import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from './task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update task', fakeAsync(() => {
    const goalID = 1;
    const task: Task = { id: 1, name: 'Task 1', description: 'Description 1', frequency: 'daily' };

    service.updateTask(goalID, task).subscribe((result) => {
      expect(result).toEqual(task);
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${goalID}/tasks/${task.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(task);
    tick();
  }));

  it('should handle error when updating task', fakeAsync(() => {
    const goalID = 1;
    const task: Task = { id: 1, name: 'Task 1', description: 'Description 1', frequency: 'daily' };
    const errorMessage = 'An unknown error occurred!';

    service.updateTask(goalID, task).subscribe({
      error: (error: string) => {
        expect(error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${goalID}/tasks/${task.id}`);
    expect(req.request.method).toBe('PUT');
    req.error(new ErrorEvent('An error occurred'), { status: 500 });
    tick();
  }));

  it('should create task', fakeAsync(() => {
    const goalID = 1;
    const task: Task = { id: 1, name: 'Task 1', description: 'Description 1', frequency: 'daily' };

    service.createTask(goalID, task).subscribe((result) => {
      expect(result).toEqual(task);
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${goalID}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush(task);
    tick();
  }));

  it('should handle error when creating task', fakeAsync(() => {
    const goalID = 1;
    const task: Task = { id: 1, name: 'Task 1', description: 'Description 1', frequency: 'daily' };
    const errorMessage = 'An unknown error occurred!';

    service.createTask(goalID, task).subscribe({
      error: (error: string) => {
        expect(error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${goalID}/tasks`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('An error occurred'), { status: 500 });
    tick();
  }));

  it('should get task by ID', fakeAsync(() => {
    const goalID = 1;
    const taskId = 1;
    const task: Task = { id: taskId, name: 'Task 1', description: 'Description 1', frequency: 'daily' };

    service.getTaskByID(goalID, taskId).subscribe((result) => {
      expect(result).toEqual(task);
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${goalID}/tasks/${taskId}`);
    expect(req.request.method).toBe('GET');
    req.flush(task);
    tick();
  }));

  it('should delete task', fakeAsync(() => {
    const goalID = 1;
    const taskId = 1;

    service.deleteTask(goalID, taskId).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/${goalID}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    tick();
  }));

});
