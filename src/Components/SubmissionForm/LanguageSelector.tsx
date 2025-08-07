// src/components/SubmissionForm/LanguageSelector.tsx
import React from 'react';
import { Language, LANGUAGE_OPTIONS } from '../../../../constants/languages';

interface Props {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({ language, setLanguage, disabled }) => (
  <select
    aria-label="Select programming language"
    value={language}
    onChange={(e) => setLanguage(e.target.value as Language)}
    disabled={disabled}
    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {LANGUAGE_OPTIONS.map((lang) => (
      <option key={lang.value} value={lang.value}>
        {lang.label}
      </option>
    ))}
  </select>
);
