import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GoalService } from './goal.service';
import { Goal } from './goal.model';

describe('GoalService', () => {
    let service: GoalService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GoalService]
        });
        service = TestBed.inject(GoalService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should retrieve goals from the API via GET', () => {
        const pageID = 1;
        const pageSize = 10;
        const mockGoals: Goal[] = [{ id: 1, name: 'Goal 1', description: 'Description 1', start_date: new Date(), target_date: new Date() }];

        service.getGoals(pageID, pageSize).subscribe(goals => {
            expect(goals).toEqual(mockGoals);
        });

        const req = httpTestingController.expectOne(`https://localhost/api/v1/goals/?page_id=${pageID}&page_size=${pageSize}`);
        expect(req.request.method).toEqual('GET');
        req.flush(mockGoals);
    });

    it('should retrieve a specific goal by ID from the API via GET', () => {
        const id = 1;
        const mockGoal: Goal = { id: 1, name: 'Goal 1', description: 'Description 1', start_date: new Date(), target_date: new Date() };

        service.getGoalById(id).subscribe(goal => {
            expect(goal).toEqual(mockGoal);
        });

        const req = httpTestingController.expectOne(`https://localhost/api/v1/goals/${id}`);
        expect(req.request.method).toEqual('GET');
        req.flush(mockGoal);
    });
});
