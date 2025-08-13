import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ProblemFormData, ProblemFormState, TestCase } from '@/Models';



const initialFormData: ProblemFormData = {
  title: '',
  description: '',
  difficulty: 'Easy',
  timeLimit: 1000,
  memoryLimit: 256,
  tags: [],
  category: '',
  inputFormat: '',
  outputFormat: '',
  languageSolutions: [], 
  testCases: [
    { id: 1, input: '', expectedOutput: '', isHidden: false },
    { id: 2, input: '', expectedOutput: '', isHidden: false }
  ]
};

const initialState: ProblemFormState = {
  formData: initialFormData,
  originalData: null,
  isLoading: false,
  errors: {},
  isDirty: false,
  mode: 'add',
  problemId: null,
  status: {
    submit: 'idle',
    load: 'idle',
    delete: 'idle'
  }
};

// Async thunk examples
export const submitProblem = createAsyncThunk(
  'problemForm/submit',
  async (
    { formData, mode, problemId }: { formData: ProblemFormData; mode: 'add' | 'edit'; problemId?: number },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        ...formData,
        testCases: formData.testCases.filter(tc => tc.input && tc.expectedOutput)
      };

      const res = mode === 'edit' && problemId
        ? await axiosInstance.put(`/admin/problems/${problemId}`, payload)
        : await axiosInstance.post(`/admin/problems`, payload);

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

// ✅ CREATE SLICE with explicit typing
const problemFormSlice = createSlice({
  name: 'problemForm',
  initialState,
  reducers: {
    updateFormData: (
      state: ProblemFormState,
      action: PayloadAction<Partial<ProblemFormData>>
    ) => {
      const newFormData = { ...state.formData, ...action.payload };
      const hasChanges = state.originalData
        ? JSON.stringify(newFormData) !== JSON.stringify(state.originalData)
        : JSON.stringify(newFormData) !== JSON.stringify(initialFormData);
      state.formData = newFormData;
      state.isDirty = hasChanges;
    },

    addTestCase: (state: ProblemFormState) => {
      const maxId = state.formData.testCases.reduce((max, tc) => Math.max(max, tc.id), 0);
      state.formData.testCases.push({
        id: maxId + 1,
        input: '',
        expectedOutput: '',
        isHidden: false
      });
      state.isDirty = true;
    },

    removeTestCase: (state: ProblemFormState, action: PayloadAction<number>) => {
      state.formData.testCases = state.formData.testCases.filter(tc => tc.id !== action.payload);
      state.isDirty = true;
    },

    updateTestCase: (
      state: ProblemFormState,
      action: PayloadAction<{ id: number; field: keyof TestCase; value: string | boolean }>
    ) => {
      const { id, field, value } = action.payload;
      const testCase = state.formData.testCases.find(tc => tc.id === id);
      if (testCase) {
        (testCase as any)[field] = value;
        state.isDirty = true;
      }
    },

    setMode: (
      state: ProblemFormState,
      action: PayloadAction<{ mode: 'add' | 'edit'; problemId?: number }>
    ) => {
      state.mode = action.payload.mode;
      state.problemId = action.payload.problemId ?? null;
    },

    resetForm: (state: ProblemFormState) => {
      state.formData = initialFormData;
      state.originalData = null;
      state.errors = {};
      state.isDirty = false;
    }
  }
});

// Export actions and reducer
export const {
  updateFormData,
  addTestCase,
  removeTestCase,
  updateTestCase,
  setMode,
  resetForm
} = problemFormSlice.actions;

export default problemFormSlice.reducer;
