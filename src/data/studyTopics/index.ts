// Main export file for all study topics
import { arrays } from './arrays';
import { binaryTrees } from './binaryTrees';
import { backtracking } from './backtracking';
import { dynamicProgramming } from './dynamicProgramming';
import { linkedLists } from './linkedLists';
import { strings } from './strings';
import { recursion } from './recursion';
import { permutationProblems } from './permutationProblems';

// Types for study content
export interface TopicSection {
  title: string;
  content: string;
  examples?: {
    language: string;
    code: string;
  }[];
}

export interface StudyTopic {
  id: string;
  title: string;
  icon: string; // Icon name from lucide-react
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  problems: number;
  introduction: string;
  sections: TopicSection[];
  practiceProblems: {
    id: number;
    title: string;
    difficulty: string;
  }[];
}

// Map for all topics, easy to query by ID
export const topicsMap: { [key: string]: StudyTopic } = {
  'arrays': arrays,
  'binary-trees': binaryTrees,
  'backtracking': backtracking,
  'dynamic-programming': dynamicProgramming,
  'linked-lists': linkedLists,
  'strings': strings,
  'recursion': recursion,
  'permutation-problems': permutationProblems
};

// List of all topics for the topics page
export const studyTopics = Object.values(topicsMap);

// Function to get a topic by ID
export const getTopicById = (id: string): StudyTopic | undefined => {
  return topicsMap[id];
};