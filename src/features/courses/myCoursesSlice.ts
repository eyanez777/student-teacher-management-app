import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface MyCourse {
  id: number;
  name: string;
  description: string;
}

interface MyCoursesState {
  myCourses: MyCourse[];
  loading: boolean;
  error: string | null;
}

const initialState: MyCoursesState = {
  myCourses: [],
  loading: false,
  error: null,
};

export const fetchMyCourses = createAsyncThunk('myCourses/fetchMyCourses', async (_, { rejectWithValue }) => {
  try {
    // Simular delay de 1.5 segundos para mostrar el spinner
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = await api.get('/users/me/courses');
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al obtener mis cursos');
  }
});

const myCoursesSlice = createSlice({
  name: 'myCourses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default myCoursesSlice.reducer;
