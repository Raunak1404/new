import { SubmissionRequest, SubmissionResponse, SubmissionResult, TestCase, languageIds } from '../types/judge0';

// Judge0 API configuration
const API_URL = 'https://judge0-ce.p.rapidapi.com';
const API_KEY = 'fcccbf1d85mshbdcfd814744f498p183721jsnb7d57b77228d';
const API_HOST = 'judge0-ce.p.rapidapi.com';

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Submit code to Judge0 API with retry logic
export const submitCode = async (
  code: string,
  language: string,
  input?: string,
  expectedOutput?: string,
  retryCount = 3,
  retryDelay = 1000
): Promise<string> => {
  try {
    const languageId = languageIds[language] || languageIds.javascript;

    const submissionData: SubmissionRequest = {
      source_code: code,
      language_id: languageId,
    };

    if (input) submissionData.stdin = input;
    if (expectedOutput) submissionData.expected_output = expectedOutput;

    const response = await fetch(`${API_URL}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
      body: JSON.stringify(submissionData),
    });

    // Handle rate limiting (429 Too Many Requests)
    if (response.status === 429 && retryCount > 0) {
      console.log(`Rate limited, retrying after ${retryDelay}ms...`);
      await delay(retryDelay);
      // Retry with exponential backoff
      return submitCode(code, language, input, expectedOutput, retryCount - 1, retryDelay * 2);
    }

    if (!response.ok) {
      throw new Error(`Failed to submit code: ${response.status} ${response.statusText}`);
    }

    const data: SubmissionResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
};

// Get submission result from Judge0 API with retry logic
export const getSubmissionResult = async (
  token: string,
  retryCount = 3,
  retryDelay = 1000
): Promise<SubmissionResult> => {
  try {
    const response = await fetch(`${API_URL}/submissions/${token}?base64_encoded=false`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    // Handle rate limiting (429 Too Many Requests)
    if (response.status === 429 && retryCount > 0) {
      console.log(`Rate limited, retrying after ${retryDelay}ms...`);
      await delay(retryDelay);
      // Retry with exponential backoff
      return getSubmissionResult(token, retryCount - 1, retryDelay * 2);
    }

    if (!response.ok) {
      throw new Error(`Failed to get submission result: ${response.status} ${response.statusText}`);
    }

    const data: SubmissionResult = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting submission result:', error);
    throw error;
  }
};

// Poll for submission result
export const pollSubmissionResult = async (token: string, maxAttempts = 10, delay = 2000): Promise<SubmissionResult> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const result = await getSubmissionResult(token);
    
    // If the status is not 'Processing' or 'In Queue', return the result
    if (result.status.id !== 1 && result.status.id !== 2) {
      return result;
    }
    
    // Otherwise, wait and try again
    await new Promise(resolve => setTimeout(resolve, delay));
    attempts++;
  }
  
  throw new Error('Submission processing timed out');
};

// Evaluate code against a test case
export const evaluateCodeWithTestCase = async (
  code: string,
  language: string,
  testCase: TestCase
): Promise<SubmissionResult> => {
  const token = await submitCode(code, language, testCase.input, testCase.expectedOutput);
  return await pollSubmissionResult(token);
};

// Evaluate code against multiple test cases with sequential processing
export const evaluateCode = async (
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<SubmissionResult[]> => {
  try {
    // Process test cases sequentially instead of in parallel to avoid rate limiting
    const results: SubmissionResult[] = [];
    
    for (const testCase of testCases) {
      // Add delay between submissions to avoid rate limiting
      if (results.length > 0) {
        await delay(1000); // Wait 1 second between submissions
      }
      
      const result = await evaluateCodeWithTestCase(code, language, testCase);
      results.push(result);
    }
    
    return results;
  } catch (error) {
    console.error('Error evaluating code:', error);
    throw error;
  }
};