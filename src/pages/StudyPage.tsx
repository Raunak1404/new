import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Code, ListTree, FileText, BarChart2, Network, Layers, GitBranch } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { studyTopics } from '../data/studyTopics';

// Get difficulty badge color
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500 text-white';
    case 'Intermediate':
      return 'bg-yellow-500 text-white';
    case 'Advanced':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Map icon names to lucide-react components
const getIconComponent = (iconName: string, size: number = 32) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Code': <Code size={size} />,
    'ListTree': <ListTree size={size} />,
    'FileText': <FileText size={size} />,
    'BarChart2': <BarChart2 size={size} />,
    'Network': <Network size={size} />,
    'Layers': <Layers size={size} />,
    'GitBranch': <GitBranch size={size} />
  };
  
  return iconMap[iconName] || <BookOpen size={size} />;
};

const StudyPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <BookOpen className="text-[var(--accent)] mr-3" size={28} />
                <h1 className="text-3xl font-bold">Study Materials</h1>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">
                Master algorithms and data structures with our comprehensive study materials. Each topic includes detailed explanations, code examples, and practice problems.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      to={`/study/${topic.id}`} 
                      className="card block hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center text-[var(--accent)]">
                          {getIconComponent(topic.icon)}
                        </div>
                        <div className="ml-4">
                          <h2 className="text-xl font-bold">{topic.title}</h2>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-[var(--text-secondary)] mb-6">
                        {topic.description}
                      </p>
                      
                      <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>⏱️ {topic.estimatedTime}</span>
                        <span>📋 {topic.problems} problems</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Learning Paths Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Interview Preparation",
                      description: "A comprehensive learning path designed to prepare you for technical interviews at top tech companies.",
                      topics: ["Arrays", "Linked Lists", "Trees", "Dynamic Programming"],
                      duration: "8 weeks",
                      level: "Intermediate to Advanced"
                    },
                    {
                      title: "Competitive Programming",
                      description: "Master algorithms and optimization techniques used in competitive programming contests.",
                      topics: ["Advanced Data Structures", "Graph Algorithms", "Dynamic Programming", "Number Theory"],
                      duration: "12 weeks",
                      level: "Advanced"
                    }
                  ].map((path, index) => (
                    <div key={index} className="card">
                      <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                      <p className="text-[var(--text-secondary)] mb-4">{path.description}</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Includes topics:</p>
                        <div className="flex flex-wrap gap-2">
                          {path.topics.map((topic, idx) => (
                            <span key={idx} className="bg-[var(--primary)] text-xs px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>⏱️ {path.duration}</span>
                        <span>🎯 {path.level}</span>
                      </div>
                      
                      <button className="btn-secondary w-full mt-4">
                        View Path
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Resource Center */}
              <div className="mt-12 mb-8">
                <h2 className="text-2xl font-bold mb-6">Resource Center</h2>
                <div className="card p-6 bg-gradient-to-r from-[var(--secondary)] to-[#2a3a64]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Books & References</h3>
                      <ul className="space-y-2 text-[var(--text-secondary)]">
                        <li className="flex items-center">
                          <span className="mr-2">📚</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Introduction to Algorithms
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📚</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Cracking the Coding Interview
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📚</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Algorithm Design Manual
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📚</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            View all resources
                          </a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Video Lectures</h3>
                      <ul className="space-y-2 text-[var(--text-secondary)]">
                        <li className="flex items-center">
                          <span className="mr-2">🎬</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Algorithms Specialization
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🎬</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Advanced Data Structures
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🎬</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Dynamic Programming Masterclass
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🎬</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            View all videos
                          </a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Practice Sets</h3>
                      <ul className="space-y-2 text-[var(--text-secondary)]">
                        <li className="flex items-center">
                          <span className="mr-2">🏆</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            FAANG Interview Questions
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🏆</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Top 100 Coding Problems
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🏆</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            Weekly Coding Challenges
                          </a>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🏆</span>
                          <a href="#" className="hover:text-[var(--accent)] transition-colors">
                            View all practice sets
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default StudyPage;