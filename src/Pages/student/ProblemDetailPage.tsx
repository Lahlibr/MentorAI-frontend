// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Play, Send, Clock, User, Star } from 'lucide-react';
// import MonacoEditor from '@/Components/common/MonacoEditor';
// import Button from '@/Components/common/Button';
// import LoadingSpinner from '@/Components/common/LoadingSpinner';
// import { SuccessMessage, ErrorMessage } from '@/Components/common/Messages';
// import { Problem } from '@/types';

// const ProblemDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [problem, setProblem] = useState<Problem | null>(null);
//   const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n    \n}');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setProblem({
//         id: id || '1',
//         title: 'Two Sum',
//         description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
//         difficulty: 'Easy' as const,
//         category: 'Arrays',
//         sampleInput: 'nums = [2,7,11,15], target = 9',
//         sampleOutput: '[0,1]',
//         constraints: '• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.',
//         createdAt: '2024-01-15T10:00:00Z'
//       });
//       setIsLoading(false);
//     }, 1000);
//   }, [id]);

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       setSuccess('Solution submitted successfully! You will receive feedback soon.');
//     } catch (err) {
//       setError('Failed to submit solution. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty.toLowerCase()) {
//       case 'easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
//       case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
//       case 'hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
//       default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-64">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (!problem) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//           Problem not found
//         </h2>
//         <Button onClick={() => navigate('/problems')}>
//           Back to Problems
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex items-center space-x-4">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => navigate('/problems')}
//           leftIcon={<ArrowLeft className="w-4 h-4" />}
//         >
//           Back to Problems
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Problem Description */}
//         <div className="space-y-6">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
//             <div className="flex items-start justify-between mb-4">
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 {problem.title}
//               </h1>
//               <div className="flex items-center space-x-2">
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
//                   {problem.difficulty}
//                 </span>
//                 <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
//                   {problem.category}
//                 </span>
//               </div>
//             </div>

//             <div className="prose dark:prose-invert max-w-none">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
//                 {problem.description}
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
//               <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                 <Clock className="w-4 h-4" />
//                 <span>Avg: 45min</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                 <User className="w-4 h-4" />
//                 <span>1.2k solved</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                 <Star className="w-4 h-4 text-yellow-400" />
//                 <span>4.5 rating</span>
//               </div>
//             </div>
//           </div>

//           {/* Examples */}
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Example
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 dark:text-white mb-2">Input:</h4>
//                 <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm">
//                   {problem.sampleInput}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900 dark:text-white mb-2">Output:</h4>
//                 <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg font-mono text-sm">
//                   {problem.sampleOutput}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Constraints */}
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Constraints
//             </h3>
//             <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm">
//               {problem.constraints}
//             </div>
//           </div>
//         </div>

//         {/* Code Editor */}
//         <div className="space-y-6">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden">
//             <div className="p-4 border-b border-gray-200 dark:border-slate-700">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                   Code Editor
//                 </h3>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     leftIcon={<Play className="w-4 h-4" />}
//                   >
//                     Run
//                   </Button>
//                   <Button
//                     onClick={handleSubmit}
//                     isLoading={isSubmitting}
//                     size="sm"
//                     leftIcon={<Send className="w-4 h-4" />}
//                   >
//                     Submit
//                   </Button>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-0">
//               <MonacoEditor
//                 value={code}
//                 onChange={setCode}
//                 language="javascript"
//                 height="400px"
//                 className="border-0"
//               />
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="space-y-4">
//             {error && <ErrorMessage message={error} onClose={() => setError('')} />}
//             {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}
//           </div>

//           {/* Tips */}
//           <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
//             <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
//               💡 Tips
//             </h3>
//             <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
//               <li>• Think about the time and space complexity</li>
//               <li>• Consider edge cases and boundary conditions</li>
//               <li>• Write clean, readable code with comments</li>
//               <li>• Test your solution with the provided examples</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemDetailPage;
