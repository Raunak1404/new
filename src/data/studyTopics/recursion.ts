import { StudyTopic } from './index';

export const recursion: StudyTopic = {
  id: 'recursion',
  title: 'Recursion',
  icon: 'GitBranch',
  description: 'Recursive problem-solving approaches and optimization techniques.',
  difficulty: 'Intermediate',
  estimatedTime: '5 hours',
  problems: 15,
  introduction: "Recursion is a programming technique where a function calls itself to solve a problem. It's particularly useful for problems that can be broken down into simpler versions of the same problem. Understanding recursion is essential for tackling complex algorithms and data structures.",
  sections: [
    {
      title: "Understanding Recursion",
      content: "Recursion is a powerful problem-solving technique based on breaking a problem into smaller instances of the same problem. Every recursive solution has two key components:\n\n1. Base Case(s): The simplest scenario(s) where the answer can be directly provided without further recursion\n2. Recursive Case(s): Where the function calls itself with a simpler version of the problem\n\nWithout proper base cases, recursion would continue indefinitely, causing a stack overflow. Recursion is particularly elegant for problems with a recursive structure, such as tree traversals, permutations, and divide-and-conquer algorithms.",
      examples: [
        {
          language: "JavaScript",
          code: "// Simple example: Computing factorial\nfunction factorial(n) {\n  // Base case\n  if (n <= 1) return 1;\n  \n  // Recursive case\n  return n * factorial(n - 1);\n}\n\n// Example usage\nconsole.log(factorial(5)); // 120 (5 * 4 * 3 * 2 * 1)\n\n// Simple example: Computing Fibonacci numbers\nfunction fibonacci(n) {\n  // Base cases\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  \n  // Recursive case\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// Example usage\nconsole.log(fibonacci(6)); // 8 (fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, ...)"
        }
      ]
    },
    {
      title: "Recursion Patterns",
      content: "Several common patterns appear in recursive algorithms:\n\n1. Linear Recursion:\n   - The function makes a single recursive call at each step\n   - Examples: Factorial, Linear Search\n\n2. Binary Recursion:\n   - The function makes two recursive calls at each step\n   - Examples: Fibonacci, Binary Tree traversal\n\n3. Multiple Recursion:\n   - The function makes multiple recursive calls\n   - Examples: Permutations, Combinations\n\n4. Mutual Recursion:\n   - Two or more functions call each other\n   - Examples: Even/Odd checkers, Tree traversals with different node types\n\n5. Tail Recursion:\n   - Recursive call is the last operation in the function\n   - Can be optimized by compilers into iteration",
      examples: [
        {
          language: "JavaScript",
          code: "// Linear Recursion: Sum of array elements\nfunction sum(arr, index = 0) {\n  // Base case\n  if (index >= arr.length) return 0;\n  \n  // Recursive case (linear - one call)\n  return arr[index] + sum(arr, index + 1);\n}\n\n// Binary Recursion: Merge Sort\nfunction mergeSort(arr) {\n  // Base case\n  if (arr.length <= 1) return arr;\n  \n  // Divide array in half\n  const mid = Math.floor(arr.length / 2);\n  const left = arr.slice(0, mid);\n  const right = arr.slice(mid);\n  \n  // Recursive case (binary - two calls)\n  return merge(mergeSort(left), mergeSort(right));\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let leftIndex = 0;\n  let rightIndex = 0;\n  \n  while (leftIndex < left.length && rightIndex < right.length) {\n    if (left[leftIndex] < right[rightIndex]) {\n      result.push(left[leftIndex]);\n      leftIndex++;\n    } else {\n      result.push(right[rightIndex]);\n      rightIndex++;\n    }\n  }\n  \n  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));\n}\n\n// Tail Recursion: Factorial with accumulator\nfunction factorialTail(n, accumulator = 1) {\n  // Base case\n  if (n <= 1) return accumulator;\n  \n  // Tail recursive case\n  return factorialTail(n - 1, n * accumulator);\n}"
        }
      ]
    },
    {
      title: "Recursion vs. Iteration",
      content: "Both recursion and iteration can solve the same problems, but each has advantages:\n\n**Recursion Advantages:**\n- More elegant and concise for certain problems\n- Directly mirrors the problem's recursive structure\n- Simplifies handling recursive data structures like trees\n\n**Recursion Disadvantages:**\n- Function call overhead\n- Risk of stack overflow for deep recursion\n- Often less efficient in time and space\n\n**When to Choose Recursion:**\n- When the problem has a recursive structure\n- When code clarity is more important than performance\n- When dealing with recursive data structures\n- When iterative solution would be complex",
      examples: [
        {
          language: "JavaScript",
          code: "// Factorial: Recursion vs. Iteration\n\n// Recursive approach\nfunction factorialRecursive(n) {\n  if (n <= 1) return 1;\n  return n * factorialRecursive(n - 1);\n}\n\n// Iterative approach\nfunction factorialIterative(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}\n\n// Tree traversal: Recursion vs. Iteration\n\n// Recursive in-order traversal\nfunction inOrderRecursive(root, result = []) {\n  if (!root) return result;\n  \n  inOrderRecursive(root.left, result);\n  result.push(root.val);\n  inOrderRecursive(root.right, result);\n  \n  return result;\n}\n\n// Iterative in-order traversal\nfunction inOrderIterative(root) {\n  const result = [];\n  const stack = [];\n  let current = root;\n  \n  while (current || stack.length > 0) {\n    while (current) {\n      stack.push(current);\n      current = current.left;\n    }\n    current = stack.pop();\n    result.push(current.val);\n    current = current.right;\n  }\n  \n  return result;\n}"
        }
      ]
    },
    {
      title: "Recursion Optimization Techniques",
      content: "Recursion can be optimized using several techniques:\n\n1. Memoization:\n   - Store results of expensive function calls and return the cached result when the same inputs occur again\n   - Particularly useful for problems with overlapping subproblems (see Dynamic Programming)\n\n2. Tail Call Optimization (TCO):\n   - Convert recursive functions to tail recursive form, which some languages optimize\n   - Not all languages support TCO (JavaScript in strict mode does in some environments)\n\n3. Recurrence Relations:\n   - Mathematically analyze the recursive algorithm and convert to iteration\n   - Useful for straightforward recursions like factorial or Fibonacci\n\n4. Segmenting/Pruning:\n   - Add conditions to avoid unnecessary recursive calls\n   - Particularly useful for search algorithms",
      examples: [
        {
          language: "JavaScript",
          code: "// Memoization: Fibonacci optimization\nfunction fibonacciMemo(n, memo = {}) {\n  // Check if we've already calculated this value\n  if (n in memo) return memo[n];\n  \n  // Base cases\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  \n  // Save result in memo object\n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}\n\n// Without memoization - exponential time complexity O(2^n)\nconsole.time('Without memo');\nconsole.log(fibonacci(30));\nconsole.timeEnd('Without memo');\n\n// With memoization - linear time complexity O(n)\nconsole.time('With memo');\nconsole.log(fibonacciMemo(30));\nconsole.timeEnd('With memo');\n\n// Tail recursion: Factorial\nfunction factorial(n, accumulator = 1) {\n  'use strict'; // Enable TCO in supported environments\n  \n  if (n <= 1) return accumulator;\n  \n  // Last operation is the recursive call (tail recursion)\n  return factorial(n - 1, n * accumulator);\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy" },
    { id: 12, title: "Climbing Stairs", difficulty: "Easy" },
    { id: 19, title: "Reverse Linked List", difficulty: "Easy" },
    { id: 14, title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
    { id: 26, title: "Permutations", difficulty: "Medium" },
    { id: 7, title: "Merge k Sorted Lists", difficulty: "Hard" },
    { id: 10, title: "Regular Expression Matching", difficulty: "Hard" }
  ]
};