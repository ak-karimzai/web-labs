export class Goal {
    id?: number;
    name: string;
    description: string;
    completion_status?: string;
    start_date: Date;
    target_date: Date;
    created_at?: Date;
    updated_at?: Date;

    constructor(
        id: number,
        name: string,
        description: string,
        completionStatus: string,
        startDate: Date,
        targetDate: Date,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.completion_status = completionStatus;
        this.start_date = startDate;
        this.target_date = targetDate;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
}

export interface GoalsPaginator {
  goals: Goal[];
  page: number;
  hasMorePages: boolean;
  error?: string;
}
