export interface ICourse {
  id: number;
  name: string;
  description: string;
}

export interface ICoursesState {
  courses: ICourse[];
  loading: boolean;
  error: string | null;
}