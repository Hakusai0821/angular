import { TaskState } from "../enum/task-state";

export class Task {
  constructor(
    public subject: string,
    public state: TaskState = TaskState.None
  ) {}
}