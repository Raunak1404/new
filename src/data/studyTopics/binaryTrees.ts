import { StudyTopic } from './index';

export const binaryTrees: StudyTopic = {
  id: 'binary-trees',
  title: 'Binary Trees',
  icon: 'Layers',
  description: 'Tree traversals, balancing, and common tree operations.',
  difficulty: 'Intermediate',
  estimatedTime: '6 hours',
  problems: 16,
  introduction: "Binary trees are hierarchical data structures where each node has at most two children, referred to as the left child and right child. They are used in various applications, including search algorithms, expression parsing, and hierarchical data representation.",
  sections: [
    {
      title: "Binary Tree Fundamentals",
      content: "A binary tree is composed of nodes, where each node contains a value and references to its left and right children. The topmost node is called the root. Nodes without children are called leaves.\n\nImportant terms in binary trees:\n\n- Root: The topmost node\n- Parent/Child: Relationship between connected nodes\n- Leaf: Node with no children\n- Height: Maximum distance from root to any leaf\n- Depth: Distance from a node to the root\n- Balanced tree: Heights of left and right subtrees differ by at most one",
      examples: [
        {
          language: "JavaScript",
          code: "// Binary Tree Node definition\nclass TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\n// Creating a simple binary tree\nconst root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.right = new TreeNode(3);\nroot.left.left = new TreeNode(4);\nroot.left.right = new TreeNode(5);"
        }
      ]
    },
    {
      title: "Tree Traversals",
      content: "Tree traversals are algorithms to visit all nodes in a tree. There are several traversal methods:\n\n1. Depth-First Traversals:\n   - Pre-order: Visit root, then left subtree, then right subtree (Root-Left-Right)\n   - In-order: Visit left subtree, then root, then right subtree (Left-Root-Right)\n   - Post-order: Visit left subtree, then right subtree, then root (Left-Right-Root)\n\n2. Breadth-First Traversal (Level Order):\n   - Visit all nodes at the same level before moving to the next level",
      examples: [
        {
          language: "JavaScript",
          code: "// Pre-order traversal (Root-Left-Right)\nfunction preorderTraversal(root) {\n  if (!root) return [];\n  const result = [];\n  \n  function dfs(node) {\n    if (!node) return;\n    \n    // Root\n    result.push(node.val);\n    \n    // Left\n    dfs(node.left);\n    \n    // Right\n    dfs(node.right);\n  }\n  \n  dfs(root);\n  return result;\n}\n\n// In-order traversal (Left-Root-Right)\nfunction inorderTraversal(root) {\n  if (!root) return [];\n  const result = [];\n  \n  function dfs(node) {\n    if (!node) return;\n    \n    // Left\n    dfs(node.left);\n    \n    // Root\n    result.push(node.val);\n    \n    // Right\n    dfs(node.right);\n  }\n  \n  dfs(root);\n  return result;\n}\n\n// Level order traversal (BFS)\nfunction levelOrderTraversal(root) {\n  if (!root) return [];\n  \n  const result = [];\n  const queue = [root];\n  \n  while (queue.length > 0) {\n    const level = [];\n    const levelSize = queue.length;\n    \n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      \n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    \n    result.push(level);\n  }\n  \n  return result;\n}"
        }
      ]
    },
    {
      title: "Binary Search Trees (BST)",
      content: "A Binary Search Tree is a special type of binary tree where:\n\n- The left subtree of a node contains only nodes with keys less than the node's key\n- The right subtree of a node contains only nodes with keys greater than the node's key\n- Both the left and right subtrees must also be binary search trees\n\nBSTs provide efficient operations for search, insertion, and deletion with an average time complexity of O(log n) when the tree is balanced.",
      examples: [
        {
          language: "JavaScript",
          code: "// BST Node definition (same as regular TreeNode)\nclass TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\n// BST Search operation\nfunction search(root, key) {\n  // Base cases: root is null or key is present at root\n  if (root === null || root.val === key)\n    return root;\n    \n  // Key is greater than root's key\n  if (root.val < key)\n    return search(root.right, key);\n    \n  // Key is smaller than root's key\n  return search(root.left, key);\n}\n\n// BST Insert operation\nfunction insert(root, key) {\n  // If the tree is empty, return a new node\n  if (root === null) {\n    return new TreeNode(key);\n  }\n  \n  // Otherwise, recur down the tree\n  if (key < root.val)\n    root.left = insert(root.left, key);\n  else if (key > root.val)\n    root.right = insert(root.right, key);\n    \n  // Return the (unchanged) node pointer\n  return root;\n}"
        }
      ]
    },
    {
      title: "Tree Balancing",
      content: "In a balanced tree, the height of the left and right subtrees of any node differ by at most 1. This balance ensures O(log n) operations.\n\nWhen trees become unbalanced, operations can degrade to O(n) time complexity in the worst case. Several self-balancing tree structures exist:\n\n- AVL Trees: Strictly balanced, with rotations after insertion/deletion\n- Red-Black Trees: Approximately balanced, used in many language libraries\n- B-trees: Used in databases and file systems\n\nBalancing operations typically involve rotations (left rotation, right rotation, or combinations) to redistribute nodes while maintaining the BST property.",
      examples: [
        {
          language: "JavaScript",
          code: "// Function to get height of a node\nfunction height(node) {\n  if (node === null)\n    return 0;\n  return Math.max(height(node.left), height(node.right)) + 1;\n}\n\n// Get balance factor of a node\nfunction getBalance(node) {\n  if (node === null)\n    return 0;\n  return height(node.left) - height(node.right);\n}\n\n// Right rotation\nfunction rightRotate(y) {\n  const x = y.left;\n  const T2 = x.right;\n\n  // Perform rotation\n  x.right = y;\n  y.left = T2;\n\n  return x;\n}\n\n// Left rotation\nfunction leftRotate(x) {\n  const y = x.right;\n  const T2 = y.left;\n\n  // Perform rotation\n  y.left = x;\n  x.right = T2;\n\n  return y;\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 14, title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
    { id: 101, title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
    { id: 102, title: "Symmetric Tree", difficulty: "Easy" },
    { id: 103, title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
    { id: 104, title: "Validate Binary Search Tree", difficulty: "Medium" },
    { id: 105, title: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
    { id: 17, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" }
  ]
};