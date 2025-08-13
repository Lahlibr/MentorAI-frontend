// src/store/slices/problemsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ApiResponse } from '@/api/ApiResponce';

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  testCasesCount: number;
  createdAt: string;
  updatedAt: string;
}
interface ProblemsApiResponse {
  problems: Problem[];
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

interface ProblemsState {
  problems: Problem[];
  filteredProblems: Problem[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedDifficulty: string;
  sortBy: 'title' | 'difficulty' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  lastFetch: number | null;
  deletingIds: number[]; // ✅ Changed from Set<number> to number[]
  stats: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

const initialState: ProblemsState = {
  problems: [],
  filteredProblems: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedDifficulty: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  lastFetch: null,
  deletingIds: [], 
  stats: {
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0
  }
};

// Async thunks

export const fetchProblems = createAsyncThunk<
  ProblemsApiResponse,        
  { force?: boolean } | void,   
  { state: { problems: ProblemsState } } // 
>(
  'problems/fetchProblems',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const now = Date.now();

      
      if (
        !params?.force &&
        state.problems.lastFetch &&
        now - state.problems.lastFetch < 5 * 60 * 1000
      ) {
        
        return {
          problems: state.problems.problems,
          total: state.problems.stats.total,
          easy: state.problems.stats.easy,
          medium: state.problems.stats.medium,
          hard: state.problems.stats.hard
        };
      }

      const response = await axiosInstance.get('/admin/problems');
      
      const data = response.data;

      

      if (!data || !Array.isArray(data.problems)) {
        throw new Error('Invalid problems data from server');
      }
    
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || 'Failed to fetch problems'
      );
    }
  }
);


export const deleteProblem = createAsyncThunk(
  'problems/deleteProblem',
  async ({ problemId, problemTitle }: { problemId: number; problemTitle: string }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/problems/${problemId}`);
      return { problemId, problemTitle };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const bulkDeleteProblems = createAsyncThunk(
  'problems/bulkDeleteProblems',
  async (problemIds: number[], { rejectWithValue }) => {
    try {
      await Promise.all(
        problemIds.map(id => axiosInstance.delete(`/admin/problems/${id}`))
      );
      return problemIds;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);


const filterAndSortProblems = (
  problems: Problem[],
  searchTerm: string,
  selectedDifficulty: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Problem[] => {
  let filtered = problems.filter(problem => {
    const matchesSearch = searchTerm === '' || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  filtered.sort((a, b) => {
    let aValue: any = a[sortBy as keyof Problem];
    let bValue: any = b[sortBy as keyof Problem];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

const calculateStats = (problems: Problem[]) => ({
  total: problems.length,
  easy: problems.filter(p => p.difficulty === 'Easy').length,
  medium: problems.filter(p => p.difficulty === 'Medium').length,
  hard: problems.filter(p => p.difficulty === 'Hard').length
});

const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredProblems = filterAndSortProblems(
        state.problems,
        state.searchTerm,
        state.selectedDifficulty,
        state.sortBy,
        state.sortOrder
      );
    },
    
    setSelectedDifficulty: (state, action: PayloadAction<string>) => {
      state.selectedDifficulty = action.payload;
      state.filteredProblems = filterAndSortProblems(
        state.problems,
        state.searchTerm,
        state.selectedDifficulty,
        state.sortBy,
        state.sortOrder
      );
    },

    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy as any;
      state.sortOrder = action.payload.sortOrder;
      state.filteredProblems = filterAndSortProblems(
        state.problems,
        state.searchTerm,
        state.selectedDifficulty,
        state.sortBy,
        state.sortOrder
      );
    },

    clearError: (state) => {
      state.error = null;
    },

    addProblem: (state, action: PayloadAction<Problem>) => {
      state.problems.unshift(action.payload);
      state.stats = calculateStats(state.problems);
      state.filteredProblems = filterAndSortProblems(
        state.problems,
        state.searchTerm,
        state.selectedDifficulty,
        state.sortBy,
        state.sortOrder
      );
    },

    updateProblem: (state, action: PayloadAction<Problem>) => {
      const index = state.problems.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.problems[index] = action.payload;
        state.filteredProblems = filterAndSortProblems(
          state.problems,
          state.searchTerm,
          state.selectedDifficulty,
          state.sortBy,
          state.sortOrder
        );
      }
    }
  },

  extraReducers: (builder) => {
    builder
      // Fetch problems
      .addCase(fetchProblems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
  state.isLoading = false;
        
        if (action.payload.problems && typeof action.payload.total === 'number') {
    state.problems = action.payload.problems; 
    state.stats = {
      total: action.payload.total,
      easy: action.payload.easy,
      medium: action.payload.medium,
      hard: action.payload.hard
    };
  } 
  // fallback for old format (simple array)
  else if (Array.isArray(action.payload)) {
    state.problems = action.payload;
    state.stats = {
      total: action.payload.length,
      easy: action.payload.filter(p => p.difficulty === 'Easy').length,
      medium: action.payload.filter(p => p.difficulty === 'Medium').length,
      hard: action.payload.filter(p => p.difficulty === 'Hard').length
    };
  } else {
    state.problems = [];
    state.stats = { total: 0, easy: 0, medium: 0, hard: 0 };
  }

  // reapply your filters/sorting
  state.filteredProblems = filterAndSortProblems(
    state.problems,
    state.searchTerm,
    state.selectedDifficulty,
    state.sortBy,
    state.sortOrder
  );
})
      .addCase(fetchProblems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete problem
      .addCase(deleteProblem.pending, (state, action) => {
        const problemId = action.meta.arg.problemId;
        // ✅ Use array methods instead of Set methods
        if (!state.deletingIds.includes(problemId)) {
          state.deletingIds.push(problemId);
        }
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        const { problemId } = action.payload;
        state.problems = state.problems.filter(p => p.id !== problemId);
        // ✅ Remove from array instead of Set
        state.deletingIds = state.deletingIds.filter(id => id !== problemId);
        state.stats = calculateStats(state.problems);
        state.filteredProblems = filterAndSortProblems(
          state.problems,
          state.searchTerm,
          state.selectedDifficulty,
          state.sortBy,
          state.sortOrder
        );
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        const problemId = action.meta.arg.problemId;
        // ✅ Remove from array instead of Set
        state.deletingIds = state.deletingIds.filter(id => id !== problemId);
        state.error = action.payload as string;
      })
      
      // Bulk delete
      .addCase(bulkDeleteProblems.pending, (state, action) => {
        // ✅ Use array methods instead of Set methods
        action.meta.arg.forEach(id => {
          if (!state.deletingIds.includes(id)) {
            state.deletingIds.push(id);
          }
        });
      })
      .addCase(bulkDeleteProblems.fulfilled, (state, action) => {
        const deletedIds = action.payload;
        state.problems = state.problems.filter(p => !deletedIds.includes(p.id));
        // ✅ Filter out all deleted IDs
        state.deletingIds = state.deletingIds.filter(id => !deletedIds.includes(id));
        state.stats = calculateStats(state.problems);
        state.filteredProblems = filterAndSortProblems(
          state.problems,
          state.searchTerm,
          state.selectedDifficulty,
          state.sortBy,
          state.sortOrder
        );
      })
      .addCase(bulkDeleteProblems.rejected, (state, action) => {
        // ✅ Filter out all attempted IDs
        state.deletingIds = state.deletingIds.filter(id => !action.meta.arg.includes(id));
        state.error = action.payload as string;
      });
  }
});

export const {
  setSearchTerm,
  setSelectedDifficulty,
  setSorting,
  clearError,
  addProblem,
  updateProblem
} = problemsSlice.actions;

export default problemsSlice.reducer;
