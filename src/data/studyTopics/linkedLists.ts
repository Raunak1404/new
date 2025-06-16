import { StudyTopic } from './index';

export const linkedLists: StudyTopic = {
  id: 'linked-lists',
  title: 'Linked Lists',
  icon: 'ListTree',
  description: 'Master singly and doubly linked lists, and common operations.',
  difficulty: 'Intermediate',
  estimatedTime: '4 hours',
  problems: 18,
  introduction: "Linked lists are linear data structures where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked lists don't require contiguous memory allocation, making them efficient for insertions and deletions but less efficient for random access.",
  sections: [
    {
      title: "Introduction to Linked Lists",
      content: "A linked list is a collection of nodes where each node contains data and a reference (or link) to the next node in the sequence. The last node typically points to null, indicating the end of the list.\n\nTypes of linked lists:\n\n- Singly Linked List: Each node points to the next node\n- Doubly Linked List: Each node has pointers to both next and previous nodes\n- Circular Linked List: The last node points back to the first node instead of null\n\nKey characteristics:\n- Dynamic size (can grow and shrink at runtime)\n- Efficient insertions and deletions (O(1) when position is known)\n- Inefficient random access (O(n) worst case)\n- No wasted memory allocation",
      examples: [
        {
          language: "JavaScript",
          code: "// Singly Linked List Node\nclass ListNode {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\n// Creating a simple linked list: 1 -> 2 -> 3 -> 4\nconst head = new ListNode(1);\nhead.next = new ListNode(2);\nhead.next.next = new ListNode(3);\nhead.next.next.next = new ListNode(4);\n\n// Traversing a linked list\nfunction printList(head) {\n  let current = head;\n  let result = '';\n  \n  while (current !== null) {\n    result += current.val + ' -> ';\n    current = current.next;\n  }\n  \n  result += 'null';\n  console.log(result);\n}"
        }
      ]
    },
    {
      title: "Linked List Operations",
      content: "Common operations on linked lists include:\n\n1. Insertion:\n   - At the beginning (head): O(1)\n   - At the end (tail): O(1) if tail pointer is maintained, otherwise O(n)\n   - At a specific position: O(n) to find position, then O(1) to insert\n\n2. Deletion:\n   - From the beginning: O(1)\n   - From the end: O(n) for singly linked list, O(1) for doubly linked list with tail pointer\n   - From a specific position: O(n) to find position, then O(1) to delete\n\n3. Search: O(n) in the worst case\n\n4. Access: O(n) in the worst case",
      examples: [
        {
          language: "JavaScript",
          code: "// Insert at the beginning\nfunction insertAtHead(head, val) {\n  const newNode = new ListNode(val);\n  newNode.next = head;\n  return newNode; // New head\n}\n\n// Insert at the end\nfunction insertAtTail(head, val) {\n  const newNode = new ListNode(val);\n  \n  // If the list is empty\n  if (head === null) {\n    return newNode;\n  }\n  \n  // Traverse to find the last node\n  let current = head;\n  while (current.next !== null) {\n    current = current.next;\n  }\n  \n  // Append the new node\n  current.next = newNode;\n  return head;\n}\n\n// Delete a node with a given value\nfunction deleteNode(head, val) {\n  // If head node itself holds the value to be deleted\n  if (head !== null && head.val === val) {\n    return head.next;\n  }\n  \n  let current = head;\n  let prev = null;\n  \n  // Search for the node to be deleted\n  while (current !== null && current.val !== val) {\n    prev = current;\n    current = current.next;\n  }\n  \n  // If value wasn't found\n  if (current === null) return head;\n  \n  // Unlink the node from the list\n  prev.next = current.next;\n  \n  return head;\n}"
        }
      ]
    },
    {
      title: "Doubly Linked Lists",
      content: "In a doubly linked list, each node contains references to both the next and previous nodes. This additional pointer allows for more efficient operations at the expense of extra memory:\n\n- Advantages:\n  - Bidirectional traversal\n  - O(1) deletion from the end if the tail pointer is maintained\n  - O(1) insertion before a known node\n\n- Disadvantages:\n  - Additional memory for the prev pointer\n  - More complex implementation",
      examples: [
        {
          language: "JavaScript",
          code: "// Doubly Linked List Node\nclass DoublyListNode {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n    this.prev = null;\n  }\n}\n\n// Creating a doubly linked list\nfunction createDoublyLinkedList(values) {\n  if (!values.length) return null;\n  \n  const head = new DoublyListNode(values[0]);\n  let current = head;\n  \n  for (let i = 1; i < values.length; i++) {\n    const newNode = new DoublyListNode(values[i]);\n    current.next = newNode;\n    newNode.prev = current;\n    current = newNode;\n  }\n  \n  return head;\n}\n\n// Inserting a node after a given node\nfunction insertAfter(node, val) {\n  if (node === null) return new DoublyListNode(val);\n  \n  const newNode = new DoublyListNode(val);\n  newNode.next = node.next;\n  newNode.prev = node;\n  \n  if (node.next !== null) {\n    node.next.prev = newNode;\n  }\n  \n  node.next = newNode;\n  return newNode;\n}"
        }
      ]
    },
    {
      title: "Common Linked List Problems",
      content: "Linked lists are frequently used in interview questions due to their versatility. Common problems include:\n\n1. Detecting cycles in a linked list (Floyd's Cycle Detection Algorithm)\n2. Finding the middle element\n3. Reversing a linked list\n4. Merging two sorted lists\n5. Removing duplicates\n6. Finding the intersection of two linked lists\n7. Checking if a linked list is a palindrome",
      examples: [
        {
          language: "JavaScript",
          code: "// Detecting a cycle using Floyd's Cycle Detection Algorithm\nfunction hasCycle(head) {\n  if (!head || !head.next) return false;\n  \n  let slow = head;\n  let fast = head;\n  \n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;         // Move one step\n    fast = fast.next.next;    // Move two steps\n    \n    if (slow === fast) return true;  // Cycle detected\n  }\n  \n  return false; // No cycle\n}\n\n// Reversing a linked list\nfunction reverseList(head) {\n  let prev = null;\n  let current = head;\n  let next = null;\n  \n  while (current !== null) {\n    // Store next node\n    next = current.next;\n    \n    // Reverse the link\n    current.next = prev;\n    \n    // Move pointers one position ahead\n    prev = current;\n    current = next;\n  }\n  \n  return prev; // New head of the reversed list\n}"
        }
      ]
    }
  ],
  practiceProblems: [
    { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy" },
    { id: 19, title: "Reverse Linked List", difficulty: "Easy" },
    { id: 4, title: "Add Two Numbers", difficulty: "Medium" },
    { id: 7, title: "Merge k Sorted Lists", difficulty: "Hard" },
    { id: 18, title: "LRU Cache", difficulty: "Medium" }
  ]
};