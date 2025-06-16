import React from 'react';
import { SubmissionResult as SubmissionResultType, statusCodes } from '../types/judge0';
import { Check, X, AlertTriangle, Clock, TerminalSquare } from 'lucide-react';

interface SubmissionResultProps {
  result: SubmissionResultType;
  testCaseIndex: number;
  isHidden: boolean;
}

const SubmissionResult: React.FC<SubmissionResultProps> = ({ result, testCaseIndex, isHidden }) => {
  const getStatusColor = () => {
    switch (result.status.id) {
      case statusCodes.ACCEPTED:
        return 'text-green-400';
      case statusCodes.WRONG_ANSWER:
        return 'text-red-400';
      case statusCodes.TIME_LIMIT_EXCEEDED:
        return 'text-yellow-400';
      case statusCodes.COMPILATION_ERROR:
      case statusCodes.RUNTIME_ERROR:
        return 'text-red-400';
      default:
        return 'text-[var(--text-secondary)]';
    }
  };

  const getStatusIcon = () => {
    switch (result.status.id) {
      case statusCodes.ACCEPTED:
        return <Check className="text-green-400" size={20} />;
      case statusCodes.WRONG_ANSWER:
        return <X className="text-red-400" size={20} />;
      case statusCodes.TIME_LIMIT_EXCEEDED:
        return <Clock className="text-yellow-400" size={20} />;
      case statusCodes.COMPILATION_ERROR:
      case statusCodes.RUNTIME_ERROR:
        return <AlertTriangle className="text-red-400" size={20} />;
      default:
        return <TerminalSquare className="text-[var(--text-secondary)]" size={20} />;
    }
  };

  return (
    <div className="bg-[var(--primary)] p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-2 font-medium ${getStatusColor()}`}>
            Test Case {testCaseIndex + 1} {isHidden ? '(Hidden)' : ''}: {result.status.description}
          </span>
        </div>
        {result.time && (
          <span className="text-[var(--text-secondary)] text-sm">
            Time: {parseFloat(result.time).toFixed(2)}s
          </span>
        )}
      </div>

      {/* Only show input/output for non-hidden test cases or if there was an error */}
      {(!isHidden || result.status.id !== statusCodes.ACCEPTED) && (
        <div className="mt-2 space-y-2">
          {result.compile_output && (
            <div>
              <p className="text-sm font-medium mb-1">Compile Output:</p>
              <pre className="bg-[var(--secondary)] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap text-red-400">
                {result.compile_output}
              </pre>
            </div>
          )}

          {result.stderr && (
            <div>
              <p className="text-sm font-medium mb-1">Error:</p>
              <pre className="bg-[var(--secondary)] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap text-red-400">
                {result.stderr}
              </pre>
            </div>
          )}

          {result.stdout && (
            <div>
              <p className="text-sm font-medium mb-1">Your Output:</p>
              <pre className="bg-[var(--secondary)] p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {result.stdout}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionResult;