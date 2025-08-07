import React, { useEffect, useState } from 'react';
import { ProblemDetails } from './ProblemDetails';
import { SampleTestCases } from './SampleTestCases';
import { LanguageSelector } from './LanguageSelector';
import { SubmissionActions } from './SubmissionActions';

import toast from 'react-hot-toast';
import { ProblemDetail } from '@/Models';
import { DEFAULT_CODE_TEMPLATES } from '@/constants/languages';
import { CreateSubmissionRequest, SubmissionResult } from '@/Models/Submission';
import { submissionHub } from '../../Services/signalR/submissionHub';
import { submissionsApi } from '@/Services/api/SubmissionsApi';
import { CodeEditor } from '../../context/CodeEditor';
import { TestResult } from './TestResult';

interface Props {
  problem: ProblemDetail;
  studentId: number;
}

export const SubmissionForm: React.FC<Props> = ({ problem, studentId }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<keyof typeof DEFAULT_CODE_TEMPLATES>('python');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [problemStartTime] = useState(new Date());

  useEffect(() => {
    setCode(DEFAULT_CODE_TEMPLATES[language]);
  }, [language]);

  useEffect(() => {
    const initHub = async () => {
      await submissionHub.start();
      submissionHub.onSubmissionGraded((grade: SubmissionResult) => {
        setResult(grade);
        setSubmitting(false);

        if (grade.isCorrect) toast.success('🎉 Solution Accepted!');
        else if (grade.compileError) toast.error('Compilation Error');
        else toast.error('Wrong Answer');
      });
    };

    initHub();
    return () => {
      submissionHub.offSubmissionGraded();
    };
  }, []);

  const handleSubmit = async () => {
  if (!code.trim()) {
    toast.error('Please write some code first!');
    return;
  }

  setSubmitting(true);
  setResult(null);

  try {
    const submission: CreateSubmissionRequest = {
      problemId: problem.id,
      studentId,
      code,
      language,
      problemStartTime: problemStartTime.toISOString(),
    };

    const response = await submissionsApi.submitCode(submission);

    if (response.data?.submissionId) {
      await submissionHub.joinSubmissionGroup(Number(response.data.submissionId));
      toast.success('Code submitted! Grading in progress...');
    } else {
      throw new Error('Invalid submission response');
    }

  } catch (err) {
    console.error('Submission error:', err);
    toast.error('Failed to submit code. Please try again.');
    setSubmitting(false);
  }
};


  return (
    <div className="space-y-6">
      <ProblemDetails problem={problem} />
      <SampleTestCases problem={problem} />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Solution</h3>
          <div className="flex items-center space-x-4">
            <LanguageSelector language={language} setLanguage={setLanguage} disabled={submitting} />
            <SubmissionActions submitting={submitting} onSubmit={handleSubmit} />
          </div>
        </div>
        <CodeEditor
          language={language}
          value={code}
          onChange={setCode}
          readOnly={submitting}
        />
      </div>

      {result && <TestResult result={result} />}
    </div>
  );
};
