// This file contains all coding challenges with complete descriptions, examples, constraints, and starter code

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Example[];
  testCases?: TestCase[]; // Added test cases property
  constraints: string[];
  tags: string[];
  solved?: boolean;
}

export interface StarterCode {
  [key: string]: { [key: string]: string };
}

// Collection of all coding problems
export const codingProblems: CodeProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    // Add test cases for Two Sum
    testCases: [
      {
        input: "2,7,11,15\n9",
        expectedOutput: "0,1",
        isHidden: false
      },
      {
        input: "3,2,4\n6",
        expectedOutput: "1,2",
        isHidden: false
      },
      {
        input: "1,5,9,2\n11",
        expectedOutput: "0,2",
        isHidden: true
      },
      {
        input: "5,8,3,0,7\n10",
        expectedOutput: "1,3",
        isHidden: true
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    tags: ["Array", "Hash Table"]
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = \"()\"",
        output: "true"
      },
      {
        input: "s = \"()[]{}\"",
        output: "true"
      },
      {
        input: "s = \"(]\"",
        output: "false"
      },
      {
        input: "s = \"([)]\"",
        output: "false"
      },
      {
        input: "s = \"{[]}\"",
        output: "true"
      }
    ],
    // Add test cases for Valid Parentheses
    testCases: [
      {
        input: "()",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "()[]{}",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "({[]})",
        expectedOutput: "true",
        isHidden: true
      },
      {
        input: "({)}",
        expectedOutput: "false",
        isHidden: true
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    tags: ["Stack", "String"]
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]"
      }
    ],
    // Add test cases for Merge Two Sorted Lists
    testCases: [
      {
        input: "1,2,4\n1,3,4",
        expectedOutput: "1,1,2,3,4,4",
        isHidden: false
      },
      {
        input: "\n",
        expectedOutput: "",
        isHidden: false
      },
      {
        input: "1,3,5,7\n2,4,6",
        expectedOutput: "1,2,3,4,5,6,7",
        isHidden: true
      },
      {
        input: "\n0",
        expectedOutput: "0",
        isHidden: true
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    tags: ["Linked List", "Recursion"]
  },
  {
    id: 4,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]"
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]"
      }
    ],
    // Add test cases for Add Two Numbers
    testCases: [
      {
        input: "2,4,3\n5,6,4",
        expectedOutput: "7,0,8",
        isHidden: false
      },
      {
        input: "0\n0",
        expectedOutput: "0",
        isHidden: false
      },
      {
        input: "9,9,9\n1",
        expectedOutput: "0,0,0,1",
        isHidden: true
      },
      {
        input: "1,8\n0",
        expectedOutput: "1,8",
        isHidden: true
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    tags: ["Linked List", "Math"]
  },
  {
    id: 5,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1."
      },
      {
        input: "s = \"pwwkew\"",
        output: "3",
        explanation: "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      }
    ],
    // Add test cases for Longest Substring Without Repeating Characters
    testCases: [
      {
        input: "abcabcbb",
        expectedOutput: "3",
        isHidden: false
      },
      {
        input: "bbbbb",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "aab",
        expectedOutput: "2",
        isHidden: true
      },
      {
        input: "dvdf",
        expectedOutput: "3",
        isHidden: true
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    tags: ["String", "Sliding Window", "Hash Table"]
  },
  {
    id: 6,
    title: "Container With Most Water",
    difficulty: "Medium",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The maximum area is obtained by choosing the second and last line, with a height of min(8, 7) = 7 and a width of 8 - 1 = 7, resulting in an area of 7 * 7 = 49."
      },
      {
        input: "height = [1,1]",
        output: "1"
      }
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    tags: ["Array", "Two Pointers", "Greedy"]
  },
  {
    id: 7,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6"
      },
      {
        input: "lists = []",
        output: "[]"
      },
      {
        input: "lists = [[]]",
        output: "[]"
      }
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
      "The sum of lists[i].length won't exceed 10^4."
    ],
    tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"]
  },
  {
    id: 8,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9"
      }
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"]
  },
  {
    id: 9,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    tags: ["Array", "Binary Search", "Divide and Conquer"]
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:\n\n- '.' Matches any single character.\n- '*' Matches zero or more of the preceding element.\n\nThe matching should cover the entire input string (not partial).",
    examples: [
      {
        input: "s = \"aa\", p = \"a\"",
        output: "false",
        explanation: "\"a\" does not match the entire string \"aa\"."
      },
      {
        input: "s = \"aa\", p = \"a*\"",
        output: "true",
        explanation: "\"a*\" means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes \"aa\"."
      },
      {
        input: "s = \"ab\", p = \".*\"",
        output: "true",
        explanation: "\".*\" means zero or more of any character."
      }
    ],
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 30",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, '.', and '*'.",
      "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."
    ],
    tags: ["String", "Dynamic Programming", "Recursion"]
  },
  {
    id: 11,
    title: "Maximum Subarray",
    difficulty: "Easy",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "nums = [1]",
        output: "1"
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"]
  },
  {
    id: 12,
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps"
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"
      }
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    tags: ["Math", "Dynamic Programming", "Memoization"]
  },
  {
    id: 13,
    title: "3Sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]"
      },
      {
        input: "nums = []",
        output: "[]"
      },
      {
        input: "nums = [0]",
        output: "[]"
      }
    ],
    constraints: [
      "0 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    tags: ["Array", "Two Pointers", "Sorting"]
  },
  {
    id: 14,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]"
      },
      {
        input: "root = [1]",
        output: "[[1]]"
      },
      {
        input: "root = []",
        output: "[]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    tags: ["Tree", "Breadth-First Search", "Binary Tree"]
  },
  {
    id: 15,
    title: "Word Search",
    difficulty: "Medium",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    examples: [
      {
        input: "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'",
        output: "true"
      },
      {
        input: "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'SEE'",
        output: "true"
      },
      {
        input: "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCB'",
        output: "false"
      }
    ],
    constraints: [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consists of only lowercase and uppercase English letters."
    ],
    tags: ["Array", "Backtracking", "Matrix"]
  },
  {
    id: 16,
    title: "Word Ladder",
    difficulty: "Hard",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n\n- Every adjacent pair of words differs by a single letter.\n- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.\n- sk == endWord\n\nGiven two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    examples: [
      {
        input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        output: "5",
        explanation: "One shortest transformation sequence is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\", which is 5 words long."
      },
      {
        input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        output: "0",
        explanation: "The endWord \"cog\" is not in wordList, therefore there is no valid transformation sequence."
      }
    ],
    constraints: [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "wordList[i].length == beginWord.length",
      "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
      "beginWord != endWord",
      "All the words in wordList are unique."
    ],
    tags: ["Breadth-First Search", "Hash Table", "String"]
  },
  {
    id: 17,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    description: "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
        explanation: "The serialized format follows level order traversal, where 'null' signifies a path terminator where no node exists below."
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Design", "String", "Binary Tree"]
  },
  {
    id: 18,
    title: "LRU Cache",
    difficulty: "Medium",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
    examples: [
      {
        input: "Input\n[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]",
        output: "Output\n[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation: "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4"
      }
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"]
  },
  {
    id: 19,
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      },
      {
        input: "head = [1,2]",
        output: "[2,1]"
      },
      {
        input: "head = []",
        output: "[]"
      }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    tags: ["Linked List", "Recursion"]
  },
  {
    id: 20,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0."
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 21,
    title: "Rotate Image",
    difficulty: "Medium",
    description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]"
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]"
      }
    ],
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000"
    ],
    tags: ["Array", "Math", "Matrix"]
  },
  {
    id: 22,
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      {
        input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"
      },
      {
        input: "strs = [\"\"]",
        output: "[[\"\"]]"
      },
      {
        input: "strs = [\"a\"]",
        output: "[[\"a\"]]"
      }
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    tags: ["Array", "Hash Table", "String", "Sorting"]
  },
  {
    id: 23,
    title: "Jump Game",
    difficulty: "Medium",
    description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.",
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
        explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
        explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 10^5"
    ],
    tags: ["Array", "Dynamic Programming", "Greedy"]
  },
  {
    id: 24,
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.\n\nIf target is not found in the array, return [-1, -1].\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      {
        input: "nums = [5,7,7,8,8,10], target = 8",
        output: "[3,4]"
      },
      {
        input: "nums = [5,7,7,8,8,10], target = 6",
        output: "[-1,-1]"
      },
      {
        input: "nums = [], target = 0",
        output: "[-1,-1]"
      }
    ],
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is a non-decreasing array.",
      "-10^9 <= target <= 10^9"
    ],
    tags: ["Array", "Binary Search"]
  },
  {
    id: 25,
    title: "Unique Paths",
    difficulty: "Medium",
    description: "A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).\n\nThe robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).\n\nHow many possible unique paths are there?",
    examples: [
      {
        input: "m = 3, n = 7",
        output: "28"
      },
      {
        input: "m = 3, n = 2",
        output: "3",
        explanation: "From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Right -> Down\n3. Down -> Down -> Right"
      }
    ],
    constraints: [
      "1 <= m, n <= 100",
      "It's guaranteed that the answer will be less than or equal to 2 * 10^9."
    ],
    tags: ["Math", "Dynamic Programming", "Combinatorics"]
  },
  {
    id: 26,
    title: "Permutations",
    difficulty: "Medium",
    description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
      },
      {
        input: "nums = [0,1]",
        output: "[[0,1],[1,0]]"
      },
      {
        input: "nums = [1]",
        output: "[[1]]"
      }
    ],
    constraints: [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10",
      "All the integers of nums are unique."
    ],
    tags: ["Array", "Backtracking"]
  },
  {
    id: 27,
    title: "Minimum Path Sum",
    difficulty: "Medium",
    description: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.\n\nNote: You can only move either down or right at any point in time.",
    examples: [
      {
        input: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
        output: "7",
        explanation: "Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum."
      },
      {
        input: "grid = [[1,2,3],[4,5,6]]",
        output: "12"
      }
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 200",
      "0 <= grid[i][j] <= 100"
    ],
    tags: ["Array", "Dynamic Programming", "Matrix"]
  },
  {
    id: 28,
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.",
    examples: [
      {
        input: "s = \"aab\"",
        output: "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]"
      },
      {
        input: "s = \"a\"",
        output: "[[\"a\"]]"
      }
    ],
    constraints: [
      "1 <= s.length <= 16",
      "s contains only lowercase English letters."
    ],
    tags: ["String", "Dynamic Programming", "Backtracking"]
  },
  {
    id: 29,
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    tags: ["Array", "Sorting"]
  },
  {
    id: 30,
    title: "N-Queens",
    difficulty: "Hard",
    description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
    examples: [
      {
        input: "n = 4",
        output: "[[\".\",\"Q\",\".\",\".\"],[\".\",\".\",\".\",\"Q\"],[\"Q\",\".\",\".\",\".\"],[\".\",\".\",\"Q\",\".\"]]",
        explanation: "There exist two distinct solutions to the 4-queens puzzle as shown above."
      },
      {
        input: "n = 1",
        output: "[[\"Q\"]]"
      }
    ],
    constraints: [
      "1 <= n <= 9"
    ],
    tags: ["Array", "Backtracking"]
  }
];

// Sample starter code for different languages and problems
export const starterCode: StarterCode = {
  'twoSum': {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
};`,
    python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Your solution here
        pass`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
    }
}`,
    c: `/*
Note: The returned array must be malloced, assume caller calls free().
*/
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your solution here
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
    }
};`
  },
  'validParentheses': {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your solution here
};`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Your solution here
        pass`,
    java: `class Solution {
    public boolean isValid(String s) {
        // Your solution here
    }
}`,
    c: `bool isValid(char s) {
    // Your solution here
}`,
    cpp: `class Solution {
public:
    bool isValid(string s) {
        // Your solution here
    }
};`
  },
  'default': {
    javascript: `/**
 * Your solution here
 */
function solve(input) {
    // Write your code here
};`,
    python: `class Solution:
    def solve(self, input):
        # Write your code here
        pass`,
    java: `class Solution {
    public void solve(String input) {
        // Write your code here
    }
}`,
    c: `void solve(char input) {
    // Write your code here
}`,
    cpp: `class Solution {
public:
    void solve(string input) {
        // Write your code here
    }
};`
  }
};

// Function to get initial code snippet based on the problem and language
export const getInitialCodeSnippet = (language: string, problemId: number): string => {
  // Map problem ID to template key
  const templateMap: { [key: number]: string } = {
    1: 'twoSum',
    2: 'validParentheses',
    // Add more mappings as needed
  };

  const templateKey = templateMap[problemId] || 'default';
  return starterCode[templateKey][language] || starterCode['default'][language];
};

// This function returns a problem by its ID
export const getProblemById = (id: number): CodeProblem | undefined => {
  return codingProblems.find(problem => problem.id === id);
};