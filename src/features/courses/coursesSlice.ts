// Asociar usuarios a un curso
export const updateCourseUsers = createAsyncThunk(
  'courses/updateCourseUsers',
  async ({ id, userIds }: { id: number; userIds: number[] }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/courses/${id}/users`, { userIds });
      console.log('Respuesta de asociar usuarios:', response);
      return response.data.payload;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al asociar usuarios');
    }
  }
);
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { ICoursesState } from '../../interface/course.interface';


const initialState: ICoursesState = {
  courses: [],
  loading: false,
  error: null,
};
// Crear curso
export const createCourse = createAsyncThunk('courses/createCourse', async (data: { name: string; description: string }, { rejectWithValue }) => {
  try {
    const response = await api.post('/courses', data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al crear curso');
  }
});

// Editar curso
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, data }: { id: number; data: { name: string; description: string } }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/courses/${id}`, data);
    console.log('Respuesta de editar curso:', response);
    return response.data.payload;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al editar curso');
  }
});

// Eliminar curso
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/courses/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al eliminar curso');
  }
});

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    // Simular delay de 3 segundos para mostrar el spinner
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const response = await api.get('/courses');
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al obtener cursos');
  }
});


const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Crear curso
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Editar curso
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.courses.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) {
          state.courses[idx] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Eliminar curso
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Asociar usuarios a curso
      .addCase(updateCourseUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Actualiza el curso en el state con los nuevos usuarios
        const idx = state.courses.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) {
          state.courses[idx] = action.payload;
        }
      })
      .addCase(updateCourseUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default coursesSlice.reducer;
