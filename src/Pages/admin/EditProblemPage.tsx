// src/pages/admin/EditProblemPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, Eye, TestTube, Settings, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProblemForm } from '@/context/ProblemFormContext';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import { TestCase } from '@/Models';
import AdminSidebar from '@/Components/common/AdminSidebar';

const EditProblemPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'testcases' | 'preview'>('details');
  const [currentTag, setCurrentTag] = useState('');

  const {
  formData,
  isLoading,
  errors,
  isDirty,
  updateFormData,
  addTestCase,
  removeTestCase,
  updateTestCase,
  addTag,
  removeTag,
  submitForm,
  resetForm,
  setMode, 
  loadProblemData, 
  deleteProblem, 
} = useProblemForm();


  useEffect(() => {
    if (id) {
      const problemId = parseInt(id);
      if (!isNaN(problemId)) {
        setMode('edit', problemId);
        if (token) {
          loadProblemData(problemId, token).catch(() => {
            navigate('/admin/problems');
          });
        }
      } else {
        navigate('/admin/problems');
      }
    }
  }, [id, token, setMode, loadProblemData, navigate]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    const success = await submitForm(token);
    if (success) {
      navigate('/admin/problems');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    
    const success = await deleteProblem(token);
    if (success) {
      navigate('/admin/problems');
    }
  };

  const handleReset = () => {
    if (isDirty && !confirm('Are you sure you want to reset all changes? This action cannot be undone.')) {
      return;
    }
    resetForm();
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      addTag(currentTag.trim());
      setCurrentTag('');
    }
  };

  const tabButtons = [
    { id: 'details', label: 'Problem Details', icon: <Settings className="w-4 h-4" /> },
    { id: 'testcases', label: 'Test Cases', icon: <TestTube className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <AdminSidebar />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading problem data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                aria-label='Edit Problem'
                onClick={() => navigate('/admin/problems')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Problem</h1>
              {isDirty && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Update the coding challenge</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                         text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg 
                         hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isDirty}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg 
                         hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
              <span>{isLoading ? 'Updating...' : 'Update Problem'}</span>
            </button>
          </div>
        </div>

        
        { isDirty && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Changes detected:</strong> You have unsaved modifications. Make sure to save before leaving.
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
          {tabButtons.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content - Same as AddProblemPage but with updated handlers */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                             errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                           }`}
                  placeholder="e.g., Two Sum"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Problem Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                             errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                           }`}
                  placeholder="Describe the problem, constraints, examples..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Difficulty and Limits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    aria-label='select'
                    value={formData.difficulty}
                    onChange={(e) => updateFormData({ difficulty: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (ms)
                  </label>
                  <input
                                        aria-label='input'

                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => updateFormData({ timeLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Memory Limit (MB)
                  </label>
                  <input
                    type="number"
                                        aria-label='input'

                    value={formData.memoryLimit}
                    onChange={(e) => updateFormData({ memoryLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="64"
                    max="1024"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag:string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 
                                 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testcases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test Cases</h3>
                <button
                  onClick={addTestCase}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg 
                             hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Test Case</span>
                </button>
              </div>

              {errors.testCases && (
                <p className="text-red-500 text-sm">{errors.testCases}</p>
              )}

              <div className="space-y-4">
                {formData.testCases.map((testCase:TestCase, index:number) => (
                  <div
                    key={testCase.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 
                               bg-gray-50 dark:bg-slate-700"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Test Case {index + 1}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <input
                            type="checkbox"
                            checked={testCase.isHidden}
                            onChange={(e) => updateTestCase(testCase.id, 'isHidden', e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                          <span>Hidden</span>
                        </label>
                        <button
                                            aria-label='select'

                          onClick={() => removeTestCase(testCase.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                     bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                          placeholder="Test input..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expected Output
                        </label>
                        <textarea
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                                     bg-white dark:bg-slate-900 text-gray-900 dark:text-white 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                          placeholder="Expected output..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formData.title || 'Untitled Problem'}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        formData.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {formData.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Time: {formData.timeLimit}ms | Memory: {formData.memoryLimit}MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Description</h3>
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    {formData.description || 'No description provided'}
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag:string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Sample Test Cases</h3>
                  <div className="space-y-4">
                    {formData.testCases
                      .filter((tc:TestCase )=> !tc.isHidden && tc.input.trim() && tc.expectedOutput.trim())
                      .map((testCase:TestCase, index:number) => (
                        <div key={testCase.id} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                            Example {index + 1}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input:</p>
                              <pre className="bg-white dark:bg-slate-800 p-2 rounded border text-sm font-mono text-gray-900 dark:text-gray-100">
                                {testCase.input}
                              </pre>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output:</p>
                              <pre className="bg-white dark:bg-slate-800 p-2 rounded border text-sm font-mono text-gray-900 dark:text-gray-100">
                                {testCase.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProblemPage;
