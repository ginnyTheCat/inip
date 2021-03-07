export interface Task {
  title: string;
  description?: string;

  task: () => Promise<void>;
}
