// src/hooks/useProblems.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchProblems, deleteProblem, setSearchTerm, setSelectedDifficulty, setSorting, clearError } from '@/store/slices/problemSlice';
import toast from 'react-hot-toast';

export const useProblems = () => {
  const dispatch = useAppDispatch();
  const {
    problems,
    filteredProblems,
    isLoading,
    error,
    searchTerm,
    selectedDifficulty,
    sortBy,
    sortOrder,
    deletingIds,
    stats
  } = useAppSelector(state => state.problems);


  useEffect(() => {
    if (window.location.pathname.includes('/admin/problems')) {
      console.log("NOT loading")
      dispatch(fetchProblems({ force: false }));
    }
  }, [location.pathname,dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const refreshProblems = (force = false) => {
    dispatch(fetchProblems({ force }));
  };

  const handleDelete = async (problemId: number, problemTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${problemTitle}"? This action cannot be undone.`)) {
  return false;
}

    try {
      await dispatch(deleteProblem({ problemId, problemTitle })).unwrap();
      toast.success('Problem deleted successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to delete problem');
      return false;
    }
  };

  const updateSearch = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const updateDifficultyFilter = (difficulty: string) => {
    dispatch(setSelectedDifficulty(difficulty));
  };

  const updateSorting = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: newSortBy, sortOrder: newSortOrder }));
  };
  const isDeletingProblem = (problemId: number) => {
    return deletingIds.includes(problemId);
  };

  return {

    problems,
    filteredProblems,
    stats,
    
    
    isLoading,
    searchTerm,
    selectedDifficulty,
    sortBy,
    sortOrder,
    deletingIds,
    
  
    refreshProblems,
    handleDelete,
    updateSearch,
    updateDifficultyFilter,
    updateSorting,
    isDeletingProblem
  };
};
