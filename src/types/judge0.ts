// Types for Judge0 API integration

export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface SubmissionResponse {
  token: string;
}

export interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: string | null;
  status: {
    id: number;
    description: string;
  };
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// Language IDs for Judge0 API
export const languageIds: Record<string, number> = {
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  python: 71,      // Python (3.8.1)
  java: 62,        // Java (OpenJDK 13.0.1)
  c: 50,           // C (GCC 9.2.0)
  cpp: 54          // C++ (GCC 9.2.0)
};

// Status codes from Judge0 API
export const statusCodes = {
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR: 11,
  INTERNAL_ERROR: 12,
};