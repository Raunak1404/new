import { StudyTopic } from './index';

export const strings: StudyTopic = {
  id: 'strings',
  title: 'Strings',
  icon: 'FileText',
  description: 'String manipulation, pattern matching, and common algorithms.',
  difficulty: 'Beginner',
  estimatedTime: '3 hours',
  problems: 22,
  introduction: "Strings are sequences of characters and one of the most commonly used data types. String manipulation is fundamental to many programming tasks and plays a crucial role in areas like text processing, parsing, and pattern matching.",
  sections: [
    {
      title: "String Basics",
      content: "Strings are sequences of characters represented in memory. In most programming languages, strings can be enclosed in single quotes (''), double quotes (\"\"), or backticks (``). Different languages handle strings differently:\n\n- Some languages treat strings as primitive immutable types (like Java, JavaScript)\n- Others treat them as arrays of characters (like C)\n- Some provide rich string-specific libraries and methods\n\nCommon string operations include:\n- Concatenation (joining strings)\n- Substring extraction\n- Finding the length\n- Comparing strings\n- Searching for substrings",
      examples: [
        {
          language: "JavaScript",
          code: "// String creation\nconst str1 = 'Hello';\nconst str2 = \"World\";\nconst name = \"Alice\";\nconst greeting = `Hello, ${name}!`; // Template string with interpolation\n\n// String concatenation\nconst fullGreeting = str1 + \", \" + str2 + \"!\";\nconsole.log(fullGreeting); // \"Hello, World!\"\n\n// String length\nconst length = str1.length; // 5\n\n// Accessing characters\nconst firstChar = str1[0]; // 'H'\nconst lastChar = str1[str1.length - 1]; // 'o'\n\n// Substrings\nconst sub1 = str1.substring(1, 4); // \"ell\"\nconst sub2 = str1.slice(1, 4); // \"ell\"\n\n// Searching\nconst position = str1.indexOf('l'); // 2 (first occurrence)\nconst lastPosition = str1.lastIndexOf('l'); // 3 (last occurrence)"
        }
      ]
    },
    {
      title: "String Manipulation",
      content: "String manipulation involves changing or extracting information from strings. Common manipulations include:\n\n1. Changing case (uppercase, lowercase)\n2. Trimming whitespace\n3. Splitting into arrays\n4. Replacing substrings\n5. Regular expression operations\n\nMany languages provide built-in methods for these operations, making string manipulation straightforward.",
      examples: [
        {
          language: "JavaScript",
          code: "const text = \"  Hello, World!  \";\n\n// Case conversion\nconst upperCase = text.toUpperCase(); // \"  HELLO, WORLD!  \"\nconst lowerCase = text.toLowerCase(); // \"  hello, world!  \"\n\n// Trimming whitespace\nconst trimmed = text.trim(); // \"Hello, World!\"\n\n// Splitting\nconst words = trimmed.split(', '); // [\"Hello\", \"World!\"]\n\n// Replacing\nconst replaced = text.replace('Hello', 'Hi'); // \"  Hi, World!  \"\n\n// Regular expressions\nconst containsHello = /Hello/.test(text); // true\nconst matches = text.match(/\\w+/g); // [\"Hello\", \"World\"]\n\n// Checking\nconst startsWith = text.trim().startsWith('Hello'); // true\nconst endsWith = text.trim().endsWith('!'); // true\nconst includes = text.includes('World'); // true"
        }
      ]
    },
    {
      title: "Pattern Matching Algorithms",
      content: "Pattern matching involves finding occurrences of a pattern within a string. Several algorithms exist with different time complexities:\n\n1. Naive approach: O(m*n) - check all positions for a match\n2. Knuth-Morris-Pratt (KMP): O(m+n) - builds a prefix table to skip unnecessary comparisons\n3. Boyer-Moore: O(n/m) in best case - shifts the pattern in larger jumps\n4. Rabin-Karp: O(n+m) - uses hashing to find matches\n\nWhere m is the pattern length and n is the text length.",
      examples: [
        {
          language: "JavaScript",
          code: "// Naive pattern matching\nfunction naiveSearch(text, pattern) {\n  const matches = [];\n  const n = text.length;\n  const m = pattern.length;\n  \n  for (let i = 0; i <= n - m; i++) {\n    let j;\n    for (j = 0; j < m; j++) {\n      if (text[i + j] !== pattern[j]) {\n        break;\n      }\n    }\n    if (j === m) { // Found a match\n      matches.push(i);\n    }\n  }\n  \n  return matches;\n}\n\n// KMP Algorithm (Knuth-Morris-Pratt)\nfunction kmpSearch(text, pattern) {\n  if (pattern === '') return [];\n  \n  // Build the LPS (Longest Prefix Suffix) array\n  const lps = buildLPSArray(pattern);\n  const matches = [];\n  \n  let i = 0; // index for text\n  let j = 0; // index for pattern\n  \n  while (i < text.length) {\n    if (pattern[j] === text[i]) {\n      i++;\n      j++;\n    }\n    \n    if (j === pattern.length) {\n      // Found a match\n      matches.push(i - j);\n      j = lps[j - 1]; // Look for the next match\n    } else if (i < text.length && pattern[j] !== text[i]) {\n      if (j !== 0) {\n        j = lps[j - 1];\n      } else {\n        i++;\n      }\n    }\n  }\n  \n  return matches;\n}\n\n// Build LPS array for KMP algorithm\nfunction buildLPSArray(pattern) {\n  const lps = new Array(pattern.length).fill(0);\n  let len = 0;\n  let i = 1;\n  \n  while (i < pattern.length) {\n    if (pattern[i] === pattern[len]) {\n      len++;\n      lps[i] = len;\n      i++;\n    } else {\n      if (len !== 0) {\n        len = lps[len - 1];\n      } else {\n        lps[i] = 0;\n        i++;\n      }\n    }\n  }\n  \n  return lps;\n}"
        }
      ]
    },
    {
      title: "String Algorithms",
      content: "Several important algorithms focus on string processing:\n\n1. String Compression: Convert a string like \"AAABBC\" to \"3A2B1C\"\n2. String Rotation: Check if one string is a rotation of another\n3. Palindrome Checking: Determine if a string reads the same forward and backward\n4. Anagram Detection: Check if two strings contain the same characters in different orders\n5. Longest Common Substring: Find the longest string that is a substring of two strings\n6. Edit Distance (Levenshtein Distance): Minimum operations to transform one string to another",
      examples: [
        {
          language: "JavaScript",
          code: "// Check if a string is a palindrome\nfunction isPalindrome(str) {\n  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0;\n  let right = cleanStr.length - 1;\n  \n  while (left < right) {\n    if (cleanStr[left] !== cleanStr[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  \n  return true;\n}\n\n// Check if two strings are anagrams\nfunction areAnagrams(str1, str2) {\n  // Remove spaces and convert to lowercase\n  const normalize = str => str.toLowerCase().replace(/\\s/g, '');\n  const s1 = normalize(str1);\n  const s2 = normalize(str2);\n  \n  // Quick check on length\n  if (s1.length !== s2.length) return false;\n  \n  // Count each character\n  const charCount = {};\n  \n  for (const char of s1) {\n    charCount[char] = (charCount[char] || 0) + 1;\n  }\n  \n  for (const char of s2) {\n    if (!charCount[char]) return false;\n    charCount[char]--;\n  }\n  \n  return true;\n}\n\n// Check if one string is a rotation of another\nfunction isRotation(s1, s2) {\n  if (s1.length !== s2.length || s1.length === 0) {\n    return false;\n  }\n  \n  // Concatenate s1 with itself\n  const s1s1 = s1 + s1;\n  \n  // Check if s2 is a substring of s1s1\n  return s1s1.includes(s2);\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 2, title: "Valid Parentheses", difficulty: "Easy" },
    { id: 5, title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
    { id: 10, title: "Regular Expression Matching", difficulty: "Hard" },
    { id: 22, title: "Group Anagrams", difficulty: "Medium" },
    { id: 28, title: "Palindrome Partitioning", difficulty: "Medium" }
  ]
};