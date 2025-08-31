import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { IUsersState } from '../../interface/user.interface';

const initialState: IUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const response = await api.get('/users');
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al obtener usuarios');
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }: { id: number; data: { name: string; email: string; role: string ,password:string} }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al editar usuario');
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al eliminar usuario');
  }
});

export const updateUserCourses = createAsyncThunk('users/updateUserCourses', async ({ id, courseIds }: { id: number; courseIds: number[] }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/${id}/courses`, { courseIds });
    console.log('response data slice updateUserCourses',response.data)
    return response.data.payload;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al asociar cursos');
  }
});

export const createUser = createAsyncThunk('users/createUser', async (data: { name: string; email: string; role: string }, { rejectWithValue }) => {
  try {
    const response = await api.post('/users', data);
    console.log('response slice createUser',response.data)
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Error al crear usuario');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) {
          state.users[idx] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateUserCourses
      .addCase(updateUserCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserCourses.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) {
          state.users[idx] = action.payload;
        }
      })
      .addCase(updateUserCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createUser
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.payload || action.payload;
        if (user && user.id) {
          state.users.unshift({ courses: [], ...user });
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
