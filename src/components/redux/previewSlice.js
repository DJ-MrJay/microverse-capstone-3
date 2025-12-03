import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { POKEMON_ENDPOINT, FIRST_GENERATION_LIMIT } from '../../constants/api';

// Initial State
const initialState = {
  pokemons: [],
  loading: false,
  error: null,
};

// Base URL
const url = `${POKEMON_ENDPOINT}/?limit=${FIRST_GENERATION_LIMIT}`;

// Async Thunk
export const fetchApi = createAsyncThunk('preview/fetchApi', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch Pokémon list');
  }
});

// Slice Reducer
const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    updateImg: {
      reducer: (state, action) => {
        const pokemon = state.pokemons.find((el) => el.id === action.payload.id);
        if (pokemon) {
          pokemon.img = action.payload.img;
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApi.fulfilled, (state, action) => {
        state.loading = false;
        state.pokemons = action.payload.results.map((el, index) => ({
          id: `${index + 1}`,
          name: el.name,
          img: '',
        }));
      })
      .addCase(fetchApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch Pokémon list';
      });
  },
});

export const { updateImg } = previewSlice.actions;
export default previewSlice.reducer;
