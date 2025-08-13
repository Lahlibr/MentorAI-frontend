// src/components/CodeRunner/AdvancedCodeRunner.tsx
import React, { useState, useEffect } from 'react';
import { Play, Save, Trash2, Plus, Code, Terminal, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';

interface CodeSnippet {
  id?: number;
  title: string;
  language: string;
  code: string;
  description?: string;
  createdAt?: string;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
}

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python', icon: '🐍', defaultCode: 'print("Hello, World!")' },
  { value: 'java', label: 'Java', icon: '☕', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { value: 'cpp', label: 'C++', icon: '⚡', defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨', defaultCode: 'console.log("Hello, World!");' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷', defaultCode: 'const message: string = "Hello, World!";\nconsole.log(message);' },
  { value: 'go', label: 'Go', icon: '🐹', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { value: 'csharp', label: 'C#', icon: '💜', defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' }
];

const AdvancedCodeRunner: React.FC = () => {
  const { token } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    loadSavedSnippets();
    setCodeToDefault();
  }, []);

  useEffect(() => {
    if (!editingSnippet) {
      setCodeToDefault();
    }
  }, [selectedLanguage]);

  const setCodeToDefault = () => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.value === selectedLanguage);
    if (language && !editingSnippet) {
      setCode(language.defaultCode);
    }
  };

  const loadSavedSnippets = async () => {
    try {
      const response = await axiosInstance.get('/admin/code-snippets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedSnippets(response.data.data || []);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to run');
      return;
    }

    setIsRunning(true);
    setExecutionResult(null);

    try {
      const response = await axiosInstance.post('/admin/code/execute', {
        language: selectedLanguage,
        code: code,
        input: input
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExecutionResult(response.data.data);
      
      if (response.data.data.success) {
        toast.success('Code executed successfully!');
      } else {
        toast.error('Code execution failed');
      }
    } catch (error) {
      console.error('Code execution failed:', error);
      setExecutionResult({
        success: false,
        error: 'Failed to execute code. Please try again.'
      });
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const saveSnippet = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for the code snippet');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title,
        description,
        language: selectedLanguage,
        code
      };

      if (editingSnippet?.id) {
        await axiosInstance.put(`/admin/code-snippets/${editingSnippet.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Code snippet updated successfully!');
      } else {
        await axiosInstance.post('/admin/code-snippets', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Code snippet saved successfully!');
      }

      setShowSaveDialog(false);
      setTitle('');
      setDescription('');
      setEditingSnippet(null);
      loadSavedSnippets();
    } catch (error) {
      console.error('Failed to save snippet:', error);
      toast.error('Failed to save code snippet');
    } finally {
      setIsSaving(false);
    }
  };

  const loadSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setSelectedLanguage(snippet.language);
    setTitle(snippet.title);
    setDescription(snippet.description || '');
    setEditingSnippet(snippet);
    setExecutionResult(null);
  };

  const deleteSnippet = async (id: number) => {
    if (!confirm('Are you sure you want to delete this code snippet?')) return;

    try {
      await axiosInstance.delete(`/admin/code-snippets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Code snippet deleted successfully!');
      loadSavedSnippets();
      
      if (editingSnippet?.id === id) {
        clearEditor();
      }
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      toast.error('Failed to delete code snippet');
    }
  };

  const clearEditor = () => {
    setEditingSnippet(null);
    setTitle('');
    setDescription('');
    setInput('');
    setCodeToDefault();
    setExecutionResult(null);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === selectedLanguage);

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Code Runner & Editor</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Test and manage code snippets across multiple programming languages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with saved snippets */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Snippets</h3>
                <button
                  onClick={clearEditor}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="New Snippet"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      editingSnippet?.id === snippet.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => loadSnippet(snippet)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {SUPPORTED_LANGUAGES.find(lang => lang.value === snippet.language)?.icon}
                          </span>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {snippet.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {snippet.language}
                        </p>
                      </div>
                      <button
                        aria-label='Trash'
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSnippet(snippet.id!);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main editor area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              {/* Actions */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  {editingSnippet && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      Editing: {editingSnippet.title}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                    <span>{editingSnippet ? 'Update' : 'Save'}</span>
                  </button>
                  
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? <LoadingSpinner size="sm" /> : <Play className="w-4 h-4" />}
                    <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Programming Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <button
                      key={language.value}
                      onClick={() => setSelectedLanguage(language.value)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                        selectedLanguage === language.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{language.icon}</span>
                      <span className="text-sm font-medium">{language.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Code Editor ({currentLanguage?.label})
                  </label>
                  <button
                    onClick={setCodeToDefault}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Reset to template
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder={`Enter your ${currentLanguage?.label} code here...`}
                />
              </div>

              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input (Optional)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-sm
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter input for your program..."
                />
              </div>

              {/* Execution Result */}
              {executionResult && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Terminal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Execution Result</h3>
                    {executionResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    executionResult.success 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}>
                    {executionResult.success ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Execution Successful
                          </span>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            {executionResult.executionTime && `${executionResult.executionTime}ms`}
                            {executionResult.memoryUsed && ` • ${executionResult.memoryUsed}KB`}
                          </div>
                        </div>
                        <pre className="bg-white dark:bg-slate-800 p-3 rounded border text-sm font-mono text-gray-900 dark:text-gray-100 overflow-auto max-h-40">
{executionResult.output || 'Program executed successfully with no output.'}
                        </pre>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-medium text-red-800 dark:text-red-200 block mb-2">
                          Execution Failed
                        </span>
                        <pre className="bg-white dark:bg-slate-800 p-3 rounded border text-sm font-mono text-red-900 dark:text-red-100 overflow-auto max-h-40">
{executionResult.error || 'Unknown error occurred.'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingSnippet ? 'Update Code Snippet' : 'Save Code Snippet'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                             bg-white dark:bg-slate-900 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter snippet title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                             bg-white dark:bg-slate-900 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Optional description..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setTitle('');
                  setDescription('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveSnippet}
                disabled={!title.trim() || isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : (editingSnippet ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCodeRunner;
