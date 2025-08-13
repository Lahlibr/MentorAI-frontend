// src/pages/admin/CodeRunnerPage.tsx
import React from 'react';

import AdminSidebar from '@/Components/common/AdminSidebar';
import AdvancedCodeRunner from '@/Components/codeRunner/AdvancedcodeRunner';

const CodeRunnerPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdvancedCodeRunner />
      </main>
    </div>
  );
};

export default CodeRunnerPage;
