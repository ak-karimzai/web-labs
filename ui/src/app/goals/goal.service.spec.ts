import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GoalService } from './goal.service';
import { Goal } from './goal.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('GoalService', () => {
  let service: GoalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GoalService]
    });
    service = TestBed.inject(GoalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get goals', fakeAsync(() => {
    const mockGoals: Goal[] = [{ id: 1, name: 'Goal 1', description: 'Description 1', start_date: new Date(), target_date: new Date(), completion_status: 'Progress' }];
    const pageID = 1;
    const pageSize = 10;

    service.getGoals(pageID, pageSize).subscribe((result) => {
      expect(result.goals).toEqual(mockGoals);
      expect(result.page).toEqual(pageID);
      expect(result.hasMorePages).toBe(true);
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/?page_id=${pageID}&page_size=${pageSize}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGoals);
    tick();
  }));

  it('should handle error when getting goals', fakeAsync(() => {
    const errorMessage = 'An unknown error occurred!';
    const pageID = 1;
    const pageSize = 10;

    service.getGoals(pageID, pageSize).subscribe({
      error: (error: string) => {
        expect(error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`https://localhost/api/v1/goals/?page_id=${pageID}&page_size=${pageSize}`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('An error occurred'), { status: 500 });
    tick();
  }));
});
