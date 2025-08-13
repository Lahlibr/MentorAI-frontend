// ProblemFormContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CreateProblemDto, ProblemFormContextType, ProblemFormData, TestCase } from '@/Models';
import toast from 'react-hot-toast';
import axiosInstance from '@/api/axiosInstance';


const ProblemFormContext = createContext<ProblemFormContextType | undefined>(undefined);

export const ProblemFormProvider = ({ children }: { children: ReactNode }) => {
  
const [formData, setFormData] = useState<ProblemFormData>({
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
});


  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [problemId, setProblemId] = useState<number | null>(null);

  
  const updateFormData = (data: Partial<ProblemFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setIsDirty(true);
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        {
          id: Date.now(), // number ID
          input: '',
          expectedOutput: '',
          isHidden: false,
        },
      ],
    }));
    setIsDirty(true);
  };

  const removeTestCase = (id: number) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter(tc => tc.id !== id),
    }));
    setIsDirty(true);
  };

  const updateTestCase = (id: number, field: keyof TestCase, value: any) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.map(tc =>
        tc.id === id ? { ...tc, [field]: value } : tc
      ),
    }));
    setIsDirty(true);
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setIsDirty(true);
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
    setIsDirty(true);
  };
  const addLanguageSolution = (language: string, template: string) => {
  setFormData(prev => ({
    ...prev,
    languageSolutions: [...prev.languageSolutions, { language, solutionTemplate: template }]
  }));
};

const removeLanguageSolution = (language: string) => {
  setFormData(prev => ({
    ...prev,
    languageSolutions: prev.languageSolutions.filter(sol => sol.language !== language)
  }));
};

const updateLanguageSolution = (language: string, newTemplate: string) => {
  setFormData(prev => ({
    ...prev,
    languageSolutions: prev.languageSolutions.map(sol =>
      sol.language === language ? { ...sol, solutionTemplate: newTemplate } : sol
    )
  }));
};

  const resetForm = () => {
    setFormData({
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
    });
    setErrors({});
    setIsDirty(false);
    setMode('create');
    setProblemId(null);
  };

   const submitForm = async (token: string) => {

    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const validTestCases = formData.testCases.filter(tc => 
      tc.input.trim() && tc.expectedOutput.trim()
    );
    
    if (validTestCases.length === 0) {
      newErrors.testCases = 'At least one complete test case is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the form errors');
      return false;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
     
      const exampleTestCases = validTestCases.filter(tc => !tc.isHidden);
    const hiddenTestCases = validTestCases.filter(tc => tc.isHidden);
      
      const payload = {
  title: formData.title.trim(),
  description: formData.description.trim(),
  difficulty: formData.difficulty === "Easy" ? 0 : formData.difficulty === "Medium" ? 1 : 2,
  category: formData.category.trim(),
  inputFormat: formData.inputFormat.trim(),
  outputFormat: formData.outputFormat.trim(),

  exampleInputs: formData.testCases
    .filter(tc => !tc.isHidden && tc.input.trim())
    .map(tc => tc.input.trim()),           // Make sure at least one exists

  exampleOutputs: formData.testCases
    .filter(tc => !tc.isHidden && tc.expectedOutput.trim())
    .map(tc => tc.expectedOutput.trim()),  // Make sure at least one exists

  hiddenTestCases: formData.testCases
    .filter(tc => tc.isHidden && tc.input.trim() && tc.expectedOutput.trim())
    .map(tc => JSON.stringify({ input: tc.input.trim(), expectedOutput: tc.expectedOutput.trim() })),

  tags: formData.tags.length ? formData.tags : [],

  languageSolutions: formData.languageSolutions.length
    ? formData.languageSolutions.map(ls => ({
        language: ls.language.trim(),
        solutionTemplate: ls.solutionTemplate.trim()
      }))
    : []       // Must not be empty; ensure at least one language and template added
};



      console.log('Submitting payload:', payload);

      const response = await axiosInstance.post('/admin/problems', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      if (response.data.success || response.status === 200 || response.status === 201) {
      toast.success('Problem created successfully!');
      setIsDirty(false);
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to create problem');
    }
  } catch (error: any) {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    const errorMessage = error?.response?.data?.message || 
                        error?.response?.data?.title ||
                        error.message || 
                        'Failed to submit problem';
    setErrors({ submit: errorMessage });
    toast.error(errorMessage);
    return false;
  } finally {
    setIsLoading(false);
  }
};
  const changeMode = (newMode: 'create' | 'edit', id?: number) => {
    setMode(newMode);
    if (id !== undefined) {
      setProblemId(id);
    }
  };

  const loadProblemData = async (id: number, token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/problems/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Problem not found');

      const data = await response.json();

      setFormData({
  title: data.title,
  description: data.description,
  difficulty: data.difficulty,
  timeLimit: data.timeLimit,
  memoryLimit: data.memoryLimit,
  tags: data.tags || [],
  testCases: data.testCases || [],
  category: data.category || '',
  inputFormat: data.inputFormat || '',
  outputFormat: data.outputFormat || '',
  languageSolutions: data.languageSolutions || []
});

      setProblemId(id);
      setIsDirty(false);
    } catch (error) {
      setErrors({ load: 'Failed to load problem' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProblem = async (token: string) => {
    if (!problemId) return false;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();
      resetForm();
      return true;
    } catch (error) {
      setErrors({ delete: 'Failed to delete problem' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProblemFormContext.Provider
      value={{
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
        setMode: changeMode,
        loadProblemData,
        deleteProblem,
        addLanguageSolution,
        removeLanguageSolution,
        updateLanguageSolution,
        mode,
        problemId,
      }}
    >
      {children}
    </ProblemFormContext.Provider>
  );
};

// Custom hook
export const useProblemForm = () => {
  const context = useContext(ProblemFormContext);
  if (!context) {
    throw new Error('useProblemForm must be used within a ProblemFormProvider');
  }
  return context;
};
