import { StudyTopic } from './index';

export const dynamicProgramming: StudyTopic = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming',
  icon: 'BarChart2',
  description: 'Master DP concepts like memoization, tabulation, and state transitions.',
  difficulty: 'Advanced',
  estimatedTime: '8 hours',
  problems: 20,
  introduction: "Dynamic Programming (DP) is a technique for solving complex problems by breaking them down into simpler subproblems. It's particularly useful when subproblems overlap and have optimal substructure, meaning the optimal solution can be constructed from optimal solutions of its subproblems.",
  sections: [
    {
      title: "Introduction to Dynamic Programming",
      content: "Dynamic Programming solves complex problems by breaking them down into simpler overlapping subproblems and storing the results to avoid redundant calculations. Two key properties are required for a problem to be solved with DP:\n\n1. Overlapping Subproblems: The same subproblems are solved multiple times\n2. Optimal Substructure: The optimal solution to the problem contains optimal solutions to subproblems\n\nDP can significantly improve time complexity from exponential to polynomial for many problems.",
      examples: [
        {
          language: "JavaScript",
          code: "// Example of a problem with overlapping subproblems: Fibonacci\n\n// Recursive approach (inefficient)\nfunction fibRecursive(n) {\n  if (n <= 1) return n;\n  return fibRecursive(n - 1) + fibRecursive(n - 2);\n}\n\n// DP approach with memoization\nfunction fibMemoization(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  \n  memo[n] = fibMemoization(n - 1, memo) + fibMemoization(n - 2, memo);\n  return memo[n];\n}\n\n// DP approach with tabulation\nfunction fibTabulation(n) {\n  if (n <= 1) return n;\n  \n  const dp = new Array(n + 1);\n  dp[0] = 0;\n  dp[1] = 1;\n  \n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  \n  return dp[n];\n}"
        }
      ]
    },
    {
      title: "DP Approaches: Memoization vs. Tabulation",
      content: "There are two main approaches to implementing dynamic programming:\n\n1. Top-down (Memoization):\n   - Start with the original problem and recursively solve subproblems\n   - Store results in a cache (usually a hash map or array)\n   - Only compute each subproblem once\n   - Natural for problems with recursion\n\n2. Bottom-up (Tabulation):\n   - Start from the smallest subproblems and work up to the original problem\n   - Store results in a table (usually an array)\n   - Typically more efficient with memory and eliminates recursion overhead\n   - Often requires more careful thinking about the order of computation\n\nChoosing between these approaches depends on the specific problem and constraints.",
      examples: [
        {
          language: "JavaScript",
          code: "// Example: Calculating binomial coefficient C(n,k)\n\n// Top-down with memoization\nfunction binomialCoeffMemo(n, k, memo = {}) {\n  // Base cases\n  if (k === 0 || k === n) return 1;\n  if (k > n) return 0;\n  \n  // Check if already computed\n  const key = `${n},${k}`;\n  if (key in memo) return memo[key];\n  \n  // Recursive calculation with memoization\n  memo[key] = binomialCoeffMemo(n - 1, k - 1, memo) + binomialCoeffMemo(n - 1, k, memo);\n  return memo[key];\n}\n\n// Bottom-up with tabulation\nfunction binomialCoeffTab(n, k) {\n  // Create 2D dp table\n  const dp = Array(n + 1).fill().map(() => Array(k + 1).fill(0));\n  \n  // Fill the table in bottom-up manner\n  for (let i = 0; i <= n; i++) {\n    for (let j = 0; j <= Math.min(i, k); j++) {\n      // Base cases\n      if (j === 0 || j === i) {\n        dp[i][j] = 1;\n      } else {\n        // Use the recursive formula\n        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];\n      }\n    }\n  }\n  \n  return dp[n][k];\n}"
        }
      ]
    },
    {
      title: "Common DP Patterns",
      content: "Several patterns appear frequently in DP problems:\n\n1. Linear Sequence DP:\n   - 1D array, where dp[i] represents solution for subproblem of size i\n   - Examples: Fibonacci, Climbing Stairs\n\n2. Matrix DP:\n   - 2D array, where dp[i][j] typically represents solution for subproblem up to position (i,j)\n   - Examples: Minimum Path Sum, Unique Paths\n\n3. String DP:\n   - Problems involving operations on strings\n   - Examples: Longest Common Subsequence, Edit Distance\n\n4. Decision Making DP:\n   - Problems requiring decisions at each step\n   - Examples: Buy/Sell Stock, House Robber\n\n5. Interval DP:\n   - Problems where the state involves intervals\n   - Examples: Matrix Chain Multiplication, Burst Balloons",
      examples: [
        {
          language: "JavaScript",
          code: "// Linear Sequence DP: Maximum Subarray Sum\nfunction maxSubarraySum(nums) {\n  if (nums.length === 0) return 0;\n  \n  let maxSoFar = nums[0];\n  let maxEndingHere = nums[0];\n  \n  for (let i = 1; i < nums.length; i++) {\n    // Either extend previous subarray or start a new one\n    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n    maxSoFar = Math.max(maxSoFar, maxEndingHere);\n  }\n  \n  return maxSoFar;\n}\n\n// Matrix DP: Minimum Path Sum\nfunction minPathSum(grid) {\n  const m = grid.length;\n  const n = grid[0].length;\n  const dp = Array(m).fill().map(() => Array(n).fill(0));\n  \n  // Initialize first cell\n  dp[0][0] = grid[0][0];\n  \n  // Initialize first row\n  for (let j = 1; j < n; j++) {\n    dp[0][j] = dp[0][j-1] + grid[0][j];\n  }\n  \n  // Initialize first column\n  for (let i = 1; i < m; i++) {\n    dp[i][0] = dp[i-1][0] + grid[i][0];\n  }\n  \n  // Fill dp table\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];\n    }\n  }\n  \n  return dp[m-1][n-1];\n}"
        }
      ]
    },
    {
      title: "State Transition and Optimization",
      content: "Designing a DP solution involves:\n\n1. Defining the state: What information do we need to represent a subproblem?\n2. Establishing the recurrence relation: How do we relate a state to its subproblems?\n3. Identifying the base cases: What are the smallest subproblems with known answers?\n4. Determining the state transition: How do we iterate through states?\n5. Optimizing space (optional): Can we reduce the memory usage?\n\nSpace optimization is often possible when the current state only depends on a few previous states.",
      examples: [
        {
          language: "JavaScript",
          code: "// Knapsack Problem with space optimization\nfunction knapsack(weights, values, capacity) {\n  const n = weights.length;\n  \n  // Original 2D approach would use dp[n+1][capacity+1]\n  // Space-optimized approach only uses 1D array\n  const dp = Array(capacity + 1).fill(0);\n  \n  for (let i = 0; i < n; i++) {\n    // We iterate backward to avoid using updated values\n    for (let w = capacity; w >= weights[i]; w--) {\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n  }\n  \n  return dp[capacity];\n}\n\n// Longest Increasing Subsequence (LIS)\nfunction lengthOfLIS(nums) {\n  if (nums.length === 0) return 0;\n  \n  const n = nums.length;\n  const dp = Array(n).fill(1); // minimum LIS length is 1\n  \n  for (let i = 1; i < n; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n  }\n  \n  return Math.max(...dp);\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 11, title: "Maximum Subarray", difficulty: "Easy" },
    { id: 12, title: "Climbing Stairs", difficulty: "Easy" },
    { id: 20, title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
    { id: 23, title: "Jump Game", difficulty: "Medium" },
    { id: 25, title: "Unique Paths", difficulty: "Medium" },
    { id: 27, title: "Minimum Path Sum", difficulty: "Medium" },
    { id: 10, title: "Regular Expression Matching", difficulty: "Hard" }
  ]
};