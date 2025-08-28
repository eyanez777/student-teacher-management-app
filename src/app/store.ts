import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import coursesReducer from '../features/courses/coursesSlice';
import myCoursesReducer from '../features/courses/myCoursesSlice';

export const store = configureStore({
  reducer: {
  auth: authReducer,
  users: usersReducer,
  courses: coursesReducer,
  myCourses: myCoursesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
