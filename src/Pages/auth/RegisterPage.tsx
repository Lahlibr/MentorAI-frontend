import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Code, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ErrorMessage, SuccessMessage } from '@/Components/common/Messages';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import { UserEnum } from '@/Models';
import { ApiError } from '@/api/ApiError';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserEnum.Student // This will be 0
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Clear field error when user starts typing
  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    clearFieldError(name);
    
    // Clear general error as well
    if (error) setError('');
    
    setFormData({
      ...formData,
      [name]: name === 'role' ? parseInt(value) : value // Convert role to number
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Username validation
    if (!formData.userName.trim()) {
      errors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      errors.userName = 'Username must be at least 3 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setSuccess('');
    setFieldErrors({});

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role // This will be a number (0, 1, or 2)
      });

      setSuccess(response.message || 'Registration successful! Please check your email to verify your account.');
      
      // Reset form on success
      setFormData({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: UserEnum.Student
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error('Registration error:', err);

      if (err instanceof ApiError) {
        // Handle field-specific errors from backend
        if (err.errors && Object.keys(err.errors).length > 0) {
          const mappedErrors: Record<string, string> = {};
          
          for (const [field, messages] of Object.entries(err.errors)) {
            // Convert field names to match frontend form field names
            const fieldName = field.toLowerCase();
            let mappedFieldName = fieldName;
            
            // Map backend field names to frontend field names if needed
            if (fieldName === 'username') mappedFieldName = 'userName';
            if (fieldName === 'emailaddress') mappedFieldName = 'email';
            
            mappedErrors[mappedFieldName] = Array.isArray(messages) 
              ? messages.join(', ') 
              : String(messages);
          }
          
          setFieldErrors(mappedErrors);
          
          // If there are field errors, don't show general error
          if (Object.keys(mappedErrors).length > 0) {
            setError('Please fix the errors below');
          } else {
            setError(err.message || 'Registration failed');
          }
        } else {
          // No field-specific errors, show general error
          setError(err.message || 'Registration failed');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get input class based on error state
  const getInputClassName = (fieldName: string) => {
    const baseClass = "block w-full pl-10 pr-3 py-3 border rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors duration-200";
    const hasError = fieldErrors[fieldName];
    
    if (hasError) {
      return `${baseClass} border-red-300 dark:border-red-600 focus:ring-red-500`;
    }
    
    return `${baseClass} border-gray-300 dark:border-slate-600 focus:ring-blue-500`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join MentorAI
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your account and start learning
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${fieldErrors.userName ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <input
                
                  type="text"
                  name="userName"
                  id="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={getInputClassName('userName')}
                  placeholder="Enter your username"
                  required
                  minLength={3}
                  //aria-invalid={!!fieldErrors.userName}
                  aria-describedby={fieldErrors.userName ? 'userName-error' : undefined}
                />
              </div>
              {fieldErrors.userName && (
                <p id="userName-error" className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {fieldErrors.userName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <input
                
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClassName('email')}
                  placeholder="Enter your email"
                  required
                  
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${fieldErrors.role ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={getInputClassName('role')}
                  //aria-invalid={!!fieldErrors.role}
                  aria-describedby={fieldErrors.role ? 'role-error' : undefined}
                >
                  <option value={UserEnum.Student}>Student</option>
                  <option value={UserEnum.Reviewer}>Reviewer</option>
                </select>
              </div>
              {fieldErrors.role && (
                <p id="role-error" className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {fieldErrors.role}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${getInputClassName('password')} pr-10`}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  //aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : 'password-help'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {fieldErrors.password}
                </p>
              ) : (
                <p id="password-help" className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <input
                  
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${getInputClassName('confirmPassword')} pr-10`}
                  placeholder="Confirm your password"
                  required
                  //aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Error & Success Messages */}
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}
            {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;