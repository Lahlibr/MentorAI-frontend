import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface MessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<MessageProps> = ({ 
  message, 
  onClose, 
  className = '' 
}) => {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
  onClick={onClose}
  className="text-red-700 hover:text-red-900"
  aria-label="Close error message" // <-- add this
>
  <X className="w-4 h-4" />
</button>

      )}
    </div>
  );
};

export const SuccessMessage: React.FC<MessageProps> = ({ 
  message, 
  onClose, 
  className = '' 
}) => {
  if (!message) return null;

  return (
    <div className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
  onClick={onClose}
  className="text-green-700 hover:text-green-900"
  aria-label="Close success message" // <-- add this
>
  <X className="w-4 h-4" />
</button>

      )}
    </div>
  );
};
