import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useProblems } from '@/hooks/useProblem';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import AdminSidebar from '@/Components/common/AdminSidebar';
import ConfirmDialog from '@/Components/common/ConfirmDialog';

type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard' | number;

interface Problem {
  id: number;
  title: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  testCasesCount: number;
  createdAt: string;
}

const ManageProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProblems, setSelectedProblems] = useState<Set<number>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const {
    filteredProblems,
    isDeletingProblem,
    stats,
    isLoading,
    searchTerm,
    selectedDifficulty,
    sortBy,
    sortOrder,
    refreshProblems,
    handleDelete,
    updateSearch,
    updateDifficultyFilter,
    updateSorting
  } = useProblems();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(debouncedSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, updateSearch]);

  // Difficulty formatting
  const formatDifficulty = useCallback((value: ProblemDifficulty): string => {
    if (typeof value === 'string') return value;
    switch (value) {
      case 0: return 'Easy';
      case 1: return 'Medium';
      case 2: return 'Hard';
      default: return 'Unknown';
    }
  }, []);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }, []);

  const getSortIcon = useCallback((column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="w-3 h-3" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  }, [sortBy, sortOrder]);

  const toggleProblemSelection = useCallback((problemId: number) => {
    setSelectedProblems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(problemId)) {
        newSelected.delete(problemId);
      } else {
        newSelected.add(problemId);
      }
      return newSelected;
    });
  }, []);

  const selectAllProblems = useCallback(() => {
    setSelectedProblems(prev => 
      prev.size === filteredProblems.length 
        ? new Set() 
        : new Set(filteredProblems.map(p => p.id))
  )}, [filteredProblems]);

  const handleBulkDelete = useCallback(() => {
    if (selectedProblems.size === 0) return;
    setIsConfirmOpen(true);
  }, [selectedProblems.size]);

  const confirmBulkDelete = useCallback(async () => {
    const deletePromises = Array.from(selectedProblems).map(id => {
      const problem = filteredProblems.find(p => p.id === id);
      return problem ? handleDelete(problem.id, problem.title) : Promise.resolve(false);
    });
    
    await Promise.all(deletePromises);
    setSelectedProblems(new Set());
    setIsConfirmOpen(false);
  }, [selectedProblems, filteredProblems, handleDelete]);

  const ProblemRow = React.memo(({ 
    problem,
    isSelected,
    onToggleSelect,
    isDeleting
  }: {
    problem: Problem;
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
    isDeleting: boolean;
  }) => {
    const difficultyText = formatDifficulty(problem.difficulty);
    const difficultyColor = getDifficultyColor(difficultyText);
    
    return (
      <tr className="hover:bg-blue-500 dark:hover:bg-red-700">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(problem.id)}
            aria-label={`Select problem ${problem.title}`}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => navigate(`/problems/${problem.id}`)}
            className="text-blue-600 hover:underline dark:text-blue-700"
            aria-label={`View problem ${problem.title}`}
          >
            {problem.title}
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {problem.id}</div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
            {difficultyText}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {problem.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 rounded text-xs dark:bg-blue-900 dark:text-blue-200">
                {tag}
              </span>
            ))}
          </div>
        </td>
        <td className="px-6 py-4 text-right">{problem.testCasesCount}</td>
        <td className="px-6 py-4 text-right">
          {new Date(problem.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-right space-x-2">
          <button
            onClick={() => navigate(`/problems/${problem.id}`)}
            className="p-1 hover:text-blue-500 dark:hover:text-blue-600"
            title="View Details"
            aria-label={`View details for ${problem.title}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/admin/problems/edit/${problem.id}`)}
            className="p-1 hover:text-green-500 dark:hover:text-green-400"
            title="Edit"
            aria-label={`Edit problem ${problem.title}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(problem.id, problem.title)}
            disabled={isDeleting}
            className="p-1 hover:text-red-500 dark:hover:text-red-600 disabled:opacity-50"
            title="Delete"
            aria-label={`Delete problem ${problem.title}`}
          >
            {isDeleting ? <LoadingSpinner size="sm" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete Problems"
          message={`Are you sure you want to delete ${selectedProblems.size} selected problem(s)?`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmBulkDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Problems</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create, edit, and organize coding challenges
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => refreshProblems(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-800 rounded-lg hover:bg-gray-500 dark:hover:bg-slate-800 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Refresh problems"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/problems/AddProblem"
              className="px-6 py-2 bg-gradient-to-r from-blue-300 to-purple-500 text-white rounded-lg 
                         hover:shadow-lg transition-all duration-1000 transform hover:scale-105 flex items-center 
                         space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Add new problem"
            >
              <Plus className="w-4 h-4" />
              <span>Add Problem</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Stats cards remain the same */}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6 shadow">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="flex-1 min-w-0 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title or tags..."
                  value={debouncedSearchTerm}
                  onChange={(e) => setDebouncedSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Search problems"
                />
              </div>

              <div className="sm:w-48 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => updateDifficultyFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter by difficulty"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {selectedProblems.size > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedProblems.size} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600
                             focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Delete selected problems"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No problems match your search' : 'No problems found'}
            </div>
          ) : (
            <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedProblems.size === filteredProblems.length}
                      onChange={selectAllProblems}
                      aria-label="Select all problems"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer min-w-[200px]"
                    onClick={() => updateSorting('title')}
                  >
                    <div className="flex items-center gap-1">
                      Title {getSortIcon('title')}
                    </div>
                  </th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Tags</th>
                  <th className="px-6 py-3 text-right">Test Cases</th>
                  <th className="px-6 py-3 text-right">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredProblems.map(problem => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    isSelected={selectedProblems.has(problem.id)}
                    onToggleSelect={toggleProblemSelection}
                    isDeleting={isDeletingProblem(problem.id)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageProblemsPage;