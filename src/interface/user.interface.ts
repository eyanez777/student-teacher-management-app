export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface IUsersState {
  users: IUser[];
  loading: boolean;
  error: string | null;
}
