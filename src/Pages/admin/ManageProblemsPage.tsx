import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import Button from '@/Components/common/Button';
import Modal from '@/Components/common/Modal';
import { ErrorMessage, SuccessMessage } from '@/Components/common/Messages';
import axiosInstance from '@/api/axiosInstance';
import { Problem } from '@/Models';

const ManageProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    category: '',
    sampleInput: '',
    sampleOutput: '',
    constraints: ''
  });

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/api/problems');
        setProblems(response.data);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter;
    const matchesCategory = !categoryFilter || problem.category === categoryFilter;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleAddProblem = () => {
    setEditingProblem(null);
    setFormData({
      title: '',
      description: '',
      difficulty: 'Easy',
      category: '',
      sampleInput: '',
      sampleOutput: '',
      constraints: ''
    });
    setIsModalOpen(true);
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      constraints: problem.constraints
    });
    setIsModalOpen(true);
  };

  const handleDeleteProblem = async (problemId: number) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axiosInstance.delete(`/api/problems/${problemId}`);
      setProblems(prev => prev.filter(p => p.id !== problemId));
      setSuccess('Problem deleted successfully');
    } catch (err) {
      setError('Failed to delete problem');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingProblem) {
        // Update existing problem
        const response = await axiosInstance.put(`/api/problems/${editingProblem.id}`, formData);
        setProblems(prev => prev.map(p => 
          p.id === editingProblem.id 
            ? response.data
            : p
        ));
        setSuccess('Problem updated successfully');
      } else {
        // Add new problem
        const response = await axiosInstance.post('/api/problems', formData);
        setProblems(prev => [response.data, ...prev]);
        setSuccess('Problem created successfully');
      }
      
      setIsModalOpen(false);
      setEditingProblem(null);
    } catch (err) {
      setError('Failed to save problem');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Problems
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage coding problems for students
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAddProblem}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Problem
            </Button>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Problems</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{problems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-600 dark:bg-green-400 rounded-full"></div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Easy</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {problems.filter(p => p.difficulty === 'Easy').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Medium</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                  {problems.filter(p => p.difficulty === 'Medium').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-red-600 dark:bg-red-400 rounded-full"></div>
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Hard</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">
                  {problems.filter(p => p.difficulty === 'Hard').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            aria-label="Filter by difficulty"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Trees">Trees</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Graphs">Graphs</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {problem.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {problem.category}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {problem.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span>Created: {new Date(problem.createdAt).toLocaleDateString()}</span>
                  <span>Category: {problem.category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProblem(problem)}
                  leftIcon={<Edit className="w-4 h-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteProblem(problem.id)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No problems found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Add/Edit Problem Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProblem ? 'Edit Problem' : 'Add New Problem'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="problem-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="problem-title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="problem-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                id="problem-category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Arrays, Strings"
              />
            </div>
          </div>

          <div>
            <label htmlFor="problem-difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              id="problem-difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="problem-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="problem-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sample-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sample Input
              </label>
              <textarea
                id="sample-input"
                value={formData.sampleInput}
                onChange={(e) => setFormData({...formData, sampleInput: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="sample-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sample Output
              </label>
              <textarea
                id="sample-output"
                value={formData.sampleOutput}
                onChange={(e) => setFormData({...formData, sampleOutput: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="problem-constraints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Constraints
            </label>
            <textarea
              id="problem-constraints"
              value={formData.constraints}
              onChange={(e) => setFormData({...formData, constraints: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="e.g., 1 <= n <= 1000"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProblem ? 'Update Problem' : 'Create Problem'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProblemsPage;