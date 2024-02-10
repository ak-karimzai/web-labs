import {Goal} from "../goals/goal.model";

export class Task {
    id?: number;
    name: string;
    description: string;
    frequency: string;
    created_at?: Date;
    updated_at?: Date;
    constructor(id: number,
                name: string,
                description: string,
                frequency: string,
                createdAt: Date,
                updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.frequency = frequency;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
    }
}


export interface TasksPaginator {
  tasks: Task[];
  page: number;
  hasMorePages: boolean;
  error?: string;
}
