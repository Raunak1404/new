import { StudyTopic } from './index';

export const permutationProblems: StudyTopic = {
  id: 'permutation-problems',
  title: 'Permutation Problems',
  icon: 'Network',
  description: 'Generate permutations and solve permutation-based problems.',
  difficulty: 'Intermediate',
  estimatedTime: '4 hours',
  problems: 12,
  introduction: "Permutation problems involve generating or analyzing different arrangements of a set of elements. These problems are fundamental in combinatorics and have applications in optimization, cryptography, and algorithm design. Many permutation problems use backtracking or dynamic programming approaches.",
  sections: [
    {
      title: "Understanding Permutations",
      content: "A permutation is an arrangement of distinct objects in a specific order. For n distinct objects, there are n! (n factorial) different permutations.\n\nKey concepts in permutation problems:\n\n1. **Generation:** Creating all possible permutations of a set\n2. **Counting:** Determining the number of permutations with specific properties\n3. **Ranking:** Assigning a unique index to each permutation\n4. **Unranking:** Finding a permutation given its rank\n5. **Next/Previous:** Generating the lexicographically next or previous permutation\n\nPermutations are distinct from combinations, which don't consider the order of elements.",
      examples: [
        {
          language: "JavaScript",
          code: "// Calculate the number of permutations: n!\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\n// Example: Number of permutations of [1, 2, 3, 4, 5]\nconst n = 5;\nconsole.log(`Number of permutations of ${n} elements: ${factorial(n)}`); // 120\n\n// Finding the next lexicographical permutation\nfunction nextPermutation(nums) {\n  // Find the first element that is smaller than the element to its right\n  let i = nums.length - 2;\n  while (i >= 0 && nums[i] >= nums[i + 1]) {\n    i--;\n  }\n  \n  if (i >= 0) {\n    // Find the smallest element to the right that is larger than nums[i]\n    let j = nums.length - 1;\n    while (nums[j] <= nums[i]) {\n      j--;\n    }\n    \n    // Swap nums[i] and nums[j]\n    [nums[i], nums[j]] = [nums[j], nums[i]];\n  }\n  \n  // Reverse the subarray starting from i+1\n  let left = i + 1;\n  let right = nums.length - 1;\n  while (left < right) {\n    [nums[left], nums[right]] = [nums[right], nums[left]];\n    left++;\n    right--;\n  }\n  \n  return nums;\n}"
        }
      ]
    },
    {
      title: "Generating All Permutations",
      content: "Generating all permutations is a common task in many algorithms. Two main approaches are:\n\n1. **Backtracking:** The most flexible approach, using recursion to build permutations element by element.\n\n2. **Heap's Algorithm:** An efficient algorithm that generates all permutations by swapping elements.\n\nThese algorithms can be modified to handle special cases like:\n- Sets with duplicate elements\n- Generating only permutations that satisfy specific constraints\n- Partial permutations (k elements from n elements)",
      examples: [
        {
          language: "JavaScript",
          code: "// Generate all permutations using backtracking\nfunction permute(nums) {\n  const result = [];\n  \n  function backtrack(current, remaining) {\n    // Base case: no more elements to add\n    if (remaining.length === 0) {\n      result.push([...current]);\n      return;\n    }\n    \n    // Try each remaining element\n    for (let i = 0; i < remaining.length; i++) {\n      // Add current element to the permutation\n      current.push(remaining[i]);\n      \n      // Create new remaining array without the used element\n      const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];\n      \n      // Recursively generate permutations with the updated arrays\n      backtrack(current, newRemaining);\n      \n      // Backtrack by removing the last added element\n      current.pop();\n    }\n  }\n  \n  backtrack([], nums);\n  return result;\n}\n\n// Heap's Algorithm for generating permutations\nfunction heapPermute(arr) {\n  const result = [];\n  const n = arr.length;\n  \n  function generate(k, A) {\n    if (k === 1) {\n      result.push([...A]);\n      return;\n    }\n    \n    // Generate permutations with kth unaltered\n    generate(k - 1, A);\n    \n    // Generate permutations for kth swapped with each k-1 initial\n    for (let i = 0; i < k - 1; i++) {\n      // Swap elements\n      if (k % 2 === 0) {\n        [A[i], A[k - 1]] = [A[k - 1], A[i]];\n      } else {\n        [A[0], A[k - 1]] = [A[k - 1], A[0]];\n      }\n      \n      generate(k - 1, A);\n    }\n  }\n  \n  generate(n, arr);\n  return result;\n}"
        }
      ]
    },
    {
      title: "Permutations with Duplicates",
      content: "When dealing with sets that contain duplicate elements, we need to modify our permutation algorithms to avoid generating the same permutation multiple times. Common approaches include:\n\n1. **Sorting and Skipping:** Sort the input array and skip elements that are the same as their predecessors.\n\n2. **Frequency Counting:** Use a map to track the frequency of each element and decrement counts as elements are used.\n\n3. **Set-based Deduplication:** Generate all permutations and filter using a set, though this is less efficient.\n\nThe first two approaches are more efficient as they avoid generating duplicate permutations in the first place.",
      examples: [
        {
          language: "JavaScript",
          code: "// Generate permutations with duplicates\nfunction permuteUnique(nums) {\n  const result = [];\n  nums.sort((a, b) => a - b); // Sort the array\n  \n  function backtrack(current, used) {\n    // Base case: permutation complete\n    if (current.length === nums.length) {\n      result.push([...current]);\n      return;\n    }\n    \n    for (let i = 0; i < nums.length; i++) {\n      // Skip used elements\n      if (used[i]) continue;\n      \n      // Skip duplicates\n      if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;\n      \n      // Choose element\n      used[i] = true;\n      current.push(nums[i]);\n      \n      // Explore\n      backtrack(current, used);\n      \n      // Unchoose\n      used[i] = false;\n      current.pop();\n    }\n  }\n  \n  backtrack([], Array(nums.length).fill(false));\n  return result;\n}\n\n// Using frequency counting\nfunction permuteUniqueFreq(nums) {\n  const result = [];\n  \n  // Count frequencies\n  const counter = new Map();\n  for (const num of nums) {\n    counter.set(num, (counter.get(num) || 0) + 1);\n  }\n  \n  function backtrack(current) {\n    if (current.length === nums.length) {\n      result.push([...current]);\n      return;\n    }\n    \n    for (const [num, freq] of counter.entries()) {\n      if (freq === 0) continue;\n      \n      // Use the number\n      counter.set(num, freq - 1);\n      current.push(num);\n      \n      backtrack(current);\n      \n      // Backtrack\n      counter.set(num, freq);\n      current.pop();\n    }\n  }\n  \n  backtrack([]);\n  return result;\n}"
        }
      ]
    },
    {
      title: "Applications of Permutations",
      content: "Permutation algorithms are used in various problem domains:\n\n1. **Combinatorial Optimization:** Problems like the Traveling Salesman Problem and Job Scheduling.\n\n2. **Puzzle Solving:** 15-puzzle, Rubik's cube, and other permutation-based puzzles.\n\n3. **Cryptography:** Permutation ciphers and cryptographic algorithms.\n\n4. **Computer Science:** Token sorting, sequence alignment, and pattern matching.\n\n5. **Statistics:** Permutation tests and randomization methods.\n\nMany of these applications require either generating all permutations or finding a specific permutation that optimizes some objective function.",
      examples: [
        {
          language: "JavaScript",
          code: "// Traveling Salesman Problem (naive approach using permutations)\nfunction tsp(distances) {\n  const n = distances.length;\n  const cities = Array.from({ length: n - 1 }, (_, i) => i + 1); // Cities 1 to n-1\n  \n  // Generate all permutations of cities (excluding the starting city 0)\n  const allRoutes = permute(cities);\n  \n  let minDistance = Infinity;\n  let bestRoute = null;\n  \n  // Evaluate each route\n  for (const route of allRoutes) {\n    const fullRoute = [0, ...route, 0]; // Start and end at city 0\n    let distance = 0;\n    \n    // Calculate the total distance of this route\n    for (let i = 0; i < fullRoute.length - 1; i++) {\n      distance += distances[fullRoute[i]][fullRoute[i + 1]];\n    }\n    \n    if (distance < minDistance) {\n      minDistance = distance;\n      bestRoute = fullRoute;\n    }\n  }\n  \n  return { route: bestRoute, distance: minDistance };\n}\n\n// Example distance matrix for 4 cities\nconst distances = [\n  [0, 10, 15, 20],\n  [10, 0, 35, 25],\n  [15, 35, 0, 30],\n  [20, 25, 30, 0]\n];\n\nconst solution = tsp(distances);\nconsole.log(`Best route: ${solution.route.join(' -> ')}`);\nconsole.log(`Total distance: ${solution.distance}`);"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 26, title: "Permutations", difficulty: "Medium" },
    { id: 22, title: "Group Anagrams", difficulty: "Medium" },
    { id: 21, title: "Rotate Image", difficulty: "Medium" },
    { id: 15, title: "Word Search", difficulty: "Medium" },
    { id: 23, title: "Jump Game", difficulty: "Medium" },
    { id: 30, title: "N-Queens", difficulty: "Hard" }
  ]
};