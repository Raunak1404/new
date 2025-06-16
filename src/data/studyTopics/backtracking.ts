import { StudyTopic } from './index';

export const backtracking: StudyTopic = {
  id: 'backtracking',
  title: 'Backtracking',
  icon: 'GitBranch',
  description: 'Learn to solve complex problems using backtracking algorithms.',
  difficulty: 'Advanced',
  estimatedTime: '7 hours',
  problems: 14,
  introduction: "Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, and abandoning a path as soon as it determines that the path cannot lead to a valid solution. It's particularly useful for constraint satisfaction problems, combinatorial optimization, and puzzles.",
  sections: [
    {
      title: "Introduction to Backtracking",
      content: "Backtracking is a systematic way to explore all potential solutions to a problem. It follows a depth-first search approach, going as deep as possible along each branch before backtracking.\n\nKey principles of backtracking:\n\n1. **Choose:** Select a candidate for the solution.\n2. **Explore:** Recursively search deeper with this choice.\n3. **Unchoose:** If the choice doesn't lead to a solution, undo it and try other choices.\n\nBacktracking is more efficient than brute force because it eliminates many candidate solutions without fully exploring them, a technique known as pruning.",
      examples: [
        {
          language: "JavaScript",
          code: "// General backtracking template\nfunction backtrack(candidate, choices) {\n  // Base case: solution found\n  if (isValidSolution(candidate)) {\n    return candidate; // or collect the solution\n  }\n  \n  // Try each available choice\n  for (const choice of choices) {\n    if (isValid(candidate, choice)) {\n      // Make a choice\n      addToCandidate(candidate, choice);\n      \n      // Explore further\n      const result = backtrack(candidate, remainingChoices(choices, choice));\n      if (result) return result; // Solution found\n      \n      // Backtrack (undo the choice)\n      removeFromCandidate(candidate, choice);\n    }\n  }\n  \n  // No solution found in this path\n  return null;\n}"
        }
      ]
    },
    {
      title: "Classic Backtracking Problems",
      content: "Backtracking is the algorithm of choice for many classic problems:\n\n1. **N-Queens Problem:** Place N queens on an N×N chessboard so that no two queens threaten each other.\n\n2. **Sudoku Solver:** Fill a 9×9 grid with digits so that each column, row, and 3×3 section contain all digits from 1 to 9.\n\n3. **Permutations and Combinations:** Generate all possible arrangements or selections from a set.\n\n4. **Subset Sum:** Find a subset of elements that sum to a specific target.\n\n5. **Graph Coloring:** Assign colors to vertices so that no adjacent vertices have the same color.\n\nThese problems share the characteristic that making a single choice constrains future choices.",
      examples: [
        {
          language: "JavaScript",
          code: "// N-Queens problem\nfunction solveNQueens(n) {\n  const result = [];\n  const board = Array(n).fill().map(() => Array(n).fill('.'));\n  \n  function backtrack(row) {\n    // Base case: All queens placed\n    if (row === n) {\n      const solution = board.map(row => row.join(''));\n      result.push(solution);\n      return;\n    }\n    \n    // Try placing queen in each column of current row\n    for (let col = 0; col < n; col++) {\n      if (isValid(board, row, col, n)) {\n        // Place queen\n        board[row][col] = 'Q';\n        \n        // Move to next row\n        backtrack(row + 1);\n        \n        // Backtrack\n        board[row][col] = '.';\n      }\n    }\n  }\n  \n  // Check if placing a queen at (row, col) is valid\n  function isValid(board, row, col, n) {\n    // Check column\n    for (let i = 0; i < row; i++) {\n      if (board[i][col] === 'Q') return false;\n    }\n    \n    // Check upper-left diagonal\n    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {\n      if (board[i][j] === 'Q') return false;\n    }\n    \n    // Check upper-right diagonal\n    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {\n      if (board[i][j] === 'Q') return false;\n    }\n    \n    return true;\n  }\n  \n  backtrack(0);\n  return result;\n}"
        }
      ]
    },
    {
      title: "Optimization Techniques",
      content: "Several techniques can improve backtracking efficiency:\n\n1. **Early Pruning:** Determine as early as possible if a partial solution cannot lead to a valid solution.\n\n2. **Ordering Heuristics:** Try the most promising choices first based on some heuristic.\n\n3. **Constraint Propagation:** After making a choice, deduce and apply additional constraints to reduce the search space.\n\n4. **Symmetry Breaking:** Avoid exploring symmetric solutions that are essentially the same.\n\n5. **Bit Manipulation:** Use bits to represent state for faster operations in certain problems.\n\nThese optimizations can dramatically reduce the effective search space.",
      examples: [
        {
          language: "JavaScript",
          code: "// Sudoku solver with constraint propagation\nfunction solveSudoku(board) {\n  // Find empty cell\n  function findEmpty() {\n    for (let i = 0; i < 9; i++) {\n      for (let j = 0; j < 9; j++) {\n        if (board[i][j] === '.') {\n          return [i, j];\n        }\n      }\n    }\n    return null; // No empty cell\n  }\n  \n  // Check if number can be placed in cell\n  function isValid(row, col, num) {\n    // Check row\n    for (let j = 0; j < 9; j++) {\n      if (board[row][j] === num) return false;\n    }\n    \n    // Check column\n    for (let i = 0; i < 9; i++) {\n      if (board[i][col] === num) return false;\n    }\n    \n    // Check 3x3 box\n    const boxRow = Math.floor(row / 3) * 3;\n    const boxCol = Math.floor(col / 3) * 3;\n    \n    for (let i = 0; i < 3; i++) {\n      for (let j = 0; j < 3; j++) {\n        if (board[boxRow + i][boxCol + j] === num) return false;\n      }\n    }\n    \n    return true;\n  }\n  \n  // Backtracking function\n  function solve() {\n    const empty = findEmpty();\n    if (!empty) return true; // No empty cell means solved\n    \n    const [row, col] = empty;\n    \n    // Try digits 1-9\n    for (let num = 1; num <= 9; num++) {\n      const strNum = String(num);\n      \n      // Early pruning: check if valid before placing\n      if (isValid(row, col, strNum)) {\n        // Make a choice\n        board[row][col] = strNum;\n        \n        // Recursively try to solve rest of board\n        if (solve()) {\n          return true;\n        }\n        \n        // Backtrack\n        board[row][col] = '.';\n      }\n    }\n    \n    // No solution found with current configuration\n    return false;\n  }\n  \n  solve();\n  return board;\n}"
        }
      ]
    },
    {
      title: "Backtracking vs. Dynamic Programming",
      content: "While both backtracking and dynamic programming (DP) use recursive problem-solving, they apply to different problem types:\n\n**Backtracking:**\n- Used when we need to find all (or any) solutions to a problem\n- Typically explores the entire solution space (though with pruning)\n- Works well for constraint satisfaction and combinatorial problems\n- Usually has exponential time complexity\n\n**Dynamic Programming:**\n- Used when we need to find an optimal solution and there are overlapping subproblems\n- Stores and reuses solutions to subproblems\n- Works well for optimization problems\n- Usually has polynomial time complexity\n\nSome problems can be solved with either approach, but certain characteristics make one more suitable than the other.",
      examples: [
        {
          language: "JavaScript",
          code: "// Subset Sum problem: Backtracking approach\nfunction subsetSumBacktracking(nums, target) {\n  const result = [];\n  \n  function backtrack(start, sum, current) {\n    // Found a valid subset\n    if (sum === target) {\n      result.push([...current]);\n      return;\n    }\n    \n    // Sum exceeded target or reached end of array\n    if (sum > target || start >= nums.length) return;\n    \n    for (let i = start; i < nums.length; i++) {\n      // Skip duplicates in sorted array\n      if (i > start && nums[i] === nums[i-1]) continue;\n      \n      current.push(nums[i]);\n      backtrack(i + 1, sum + nums[i], current);\n      current.pop();\n    }\n  }\n  \n  nums.sort((a, b) => a - b); // Sort for duplicate handling\n  backtrack(0, 0, []);\n  return result;\n}\n\n// Subset Sum problem: Dynamic Programming approach\nfunction subsetSumDP(nums, target) {\n  const dp = Array(target + 1).fill(false);\n  dp[0] = true; // Empty set sums to 0\n  \n  for (const num of nums) {\n    for (let i = target; i >= num; i--) {\n      dp[i] = dp[i] || dp[i - num];\n    }\n  }\n  \n  return dp[target]; // Whether a subset exists that sums to target\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 15, title: "Word Search", difficulty: "Medium" },
    { id: 26, title: "Permutations", difficulty: "Medium" },
    { id: 28, title: "Palindrome Partitioning", difficulty: "Medium" },
    { id: 30, title: "N-Queens", difficulty: "Hard" },
    { id: 17, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" }
  ]
};