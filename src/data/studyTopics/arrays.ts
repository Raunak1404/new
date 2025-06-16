import { StudyTopic } from './index';

export const arrays: StudyTopic = {
  id: 'arrays',
  title: 'Arrays',
  icon: 'Code',
  description: 'Learn about arrays, sorting, searching, and manipulation techniques.',
  difficulty: 'Beginner',
  estimatedTime: '3 hours',
  problems: 24,
  introduction: "Arrays are one of the most fundamental data structures in computer science. They store elements of the same type in contiguous memory locations, allowing for constant-time access to any element using its index. This topic covers array manipulation, searching, sorting, and common array-based algorithms.",
  sections: [
    {
      title: "Introduction to Arrays",
      content: "Arrays provide a way to store multiple values of the same type under a single variable name. They are indexed, meaning each element can be accessed directly using its position number. Arrays are fixed in size in many languages, though dynamic arrays (like ArrayList in Java or vector in C++) can grow as needed.\n\nKey characteristics of arrays include:\n\n- Constant-time access (O(1))\n- Elements stored in contiguous memory\n- Fixed size in many languages\n- Efficient iteration\n- Can be single or multi-dimensional",
      examples: [
        {
          language: "JavaScript",
          code: "// Declaring and initializing an array\nconst numbers = [1, 2, 3, 4, 5];\n\n// Accessing elements\nconst firstElement = numbers[0]; // 1\nconst thirdElement = numbers[2]; // 3\n\n// Modifying elements\nnumbers[4] = 10; // [1, 2, 3, 4, 10]\n\n// Array length\nconst length = numbers.length; // 5"
        }
      ]
    },
    {
      title: "Array Operations",
      content: "Common operations on arrays include insertion, deletion, searching, and traversal. The time complexity of these operations varies depending on the specific requirements.\n\n- Accessing: O(1)\n- Insertion at the end (amortized): O(1)\n- Insertion at a specific position: O(n)\n- Deletion at the end: O(1)\n- Deletion at a specific position: O(n)\n- Searching (unsorted array): O(n)\n- Searching (sorted array): O(log n) using binary search",
      examples: [
        {
          language: "JavaScript",
          code: "// Insertion at the end\nnumbers.push(6); // [1, 2, 3, 4, 10, 6]\n\n// Insertion at a specific position\nnumbers.splice(2, 0, 7); // [1, 2, 7, 3, 4, 10, 6]\n\n// Deletion at the end\nnumbers.pop(); // [1, 2, 7, 3, 4, 10]\n\n// Deletion at a specific position\nnumbers.splice(3, 1); // [1, 2, 7, 4, 10]\n\n// Searching\nconst index = numbers.indexOf(7); // 2"
        }
      ]
    },
    {
      title: "Array Traversal",
      content: "Traversing an array means visiting each element exactly once. There are several ways to traverse an array:\n\n1. Using a for loop with an index\n2. Using a for-of loop (in languages that support it)\n3. Using forEach or map methods (in languages with functional programming features)\n4. Using iterators",
      examples: [
        {
          language: "JavaScript",
          code: "// Using a for loop\nfor (let i = 0; i < numbers.length; i++) {\n  console.log(numbers[i]);\n}\n\n// Using for-of loop\nfor (const num of numbers) {\n  console.log(num);\n}\n\n// Using forEach\nnumbers.forEach(num => {\n  console.log(num);\n});\n\n// Using map to transform each element\nconst doubled = numbers.map(num => num * 2);"
        }
      ]
    },
    {
      title: "Common Array Problems",
      content: "Arrays are used in many classic algorithms and interview problems. Some common array-based problems include:\n\n1. Finding the maximum/minimum element\n2. Finding the second largest element\n3. Checking if an array is sorted\n4. Removing duplicates\n5. Finding pairs with a given sum (Two Sum problem)\n6. Rotating an array\n7. Finding the majority element\n8. Kadane's algorithm for maximum subarray sum",
      examples: [
        {
          language: "JavaScript",
          code: "// Finding the maximum element\nfunction findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  return max;\n}\n\n// Two Sum problem\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 1, title: "Two Sum", difficulty: "Easy" },
    { id: 11, title: "Maximum Subarray", difficulty: "Easy" },
    { id: 20, title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
    { id: 13, title: "3Sum", difficulty: "Medium" },
    { id: 6, title: "Container With Most Water", difficulty: "Medium" },
    { id: 21, title: "Rotate Image", difficulty: "Medium" },
    { id: 24, title: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium" },
    { id: 8, title: "Trapping Rain Water", difficulty: "Hard" }
  ]
};