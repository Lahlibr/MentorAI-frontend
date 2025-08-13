import { configureStore } from '@reduxjs/toolkit';
import problemsReducer from './problemSlice';
import problemFormReducer from './problemFormSlice';

// src/store/index.ts
export const store = configureStore({
  reducer: {
    problems: problemsReducer,
    problemForm: problemFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['problems.deletingIds'], 
        ignoredActions: ['problems/fetchProblems/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
