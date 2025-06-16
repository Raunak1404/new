import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight, Code as CodeIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { codingProblems } from '../data/codingProblems';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../firebase/firebase';

// Animation variants
const floatingAnimation = {
  y: [0, -10, 0],
  transition: { 
    duration: 5, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

// Card hover animation
const cardHoverAnimation = {
  y: -5,
  scale: 1.02,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.3 }
};

// Blob animation
const blobAnimation = {
  scale: [1, 1.2, 1],
  opacity: [0.3, 0.5, 0.3],
  transition: { 
    duration: 8, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

const CodePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedProblems, setSolvedProblems] = useState<number[]>([]);
  const problemsPerPage = 10;

  // Fetch user's solved problems
  useEffect(() => {
    const fetchSolvedProblems = async () => {
      if (currentUser) {
        const { data } = await getUserProfile(currentUser.uid);
        if (data) {
          setSolvedProblems(data.solvedProblems || []);
        }
      }
    };

    fetchSolvedProblems();
  }, [currentUser]);

  // Filter problems based on search term and difficulty
  const filteredProblems = codingProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter.length === 0 || difficultyFilter.includes(problem.difficulty);
    return matchesSearch && matchesDifficulty;
  });

  // Calculate pagination
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  // Reset to page 1 if filters change or if current page is invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProblems, currentPage, totalPages]);

  const toggleDifficulty = (difficulty: string) => {
    if (difficultyFilter.includes(difficulty)) {
      setDifficultyFilter(difficultyFilter.filter(d => d !== difficulty));
    } else {
      setDifficultyFilter([...difficultyFilter, difficulty]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleProblemClick = (id: number) => {
    navigate(`/code/${id}`);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-[var(--text)]';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-16 relative overflow-hidden">
          {/* Background animated blobs */}
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent)] filter blur-[180px] opacity-5"
              animate={blobAnimation}
            />
            <motion.div 
              className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent-secondary)] filter blur-[150px] opacity-5"
              animate={{
                ...blobAnimation,
                transition: { 
                  ...blobAnimation.transition,
                  delay: 2 
                }
              }}
            />
          </motion.div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                whileInView={{
                  textShadow: [
                    "0 0 0px rgba(244, 91, 105, 0)",
                    "0 0 10px rgba(244, 91, 105, 0.3)",
                    "0 0 0px rgba(244, 91, 105, 0)"
                  ]
                }}
                viewport={{ once: true }}
                transition={{
                  textShadow: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                Coding Challenges
              </motion.h1>
              
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Search Input */}
                <motion.div 
                  className="relative flex-grow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                  <motion.input
                    type="text"
                    placeholder="Search problems by name or tag..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full py-3 pl-12 pr-4 bg-[var(--primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-base"
                    whileFocus={{ boxShadow: "0 0 0 3px rgba(244, 91, 105, 0.3)" }}
                  />
                </motion.div>
                
                {/* Filters */}
                <motion.div 
                  className="flex items-center space-x-4 shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Filter size={20} className="text-[var(--text-secondary)]" />
                  <div className="flex space-x-3">
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                      <motion.button
                        key={difficulty}
                        onClick={() => toggleDifficulty(difficulty)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          difficultyFilter.includes(difficulty)
                            ? getDifficultyColor(difficulty) + ' bg-opacity-20 bg-white'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--primary)]'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {difficulty}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* Problems Stats */}
              <motion.div 
                className="bg-[var(--primary)] bg-opacity-60 rounded-xl p-4 mb-4 flex flex-wrap justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <CodeIcon size={18} className="text-[var(--accent)] mr-2" />
                  </motion.div>
                  <span className="text-sm">
                    Total Problems: <span className="font-semibold">{filteredProblems.length}</span>
                  </span>
                </div>
                
                <div className="flex space-x-4 text-sm">
                  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                    <span>Easy: {filteredProblems.filter(p => p.difficulty === 'Easy').length}</span>
                  </motion.div>
                  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Medium: {filteredProblems.filter(p => p.difficulty === 'Medium').length}</span>
                  </motion.div>
                  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                    <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                    <span>Hard: {filteredProblems.filter(p => p.difficulty === 'Hard').length}</span>
                  </motion.div>
                </div>
                
                {totalPages > 0 && (
                  <div className="text-sm text-[var(--text-secondary)]">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </motion.div>
              
              {/* Problems List */}
              <motion.div 
                className="bg-[var(--secondary)] bg-opacity-80 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6 mb-8 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                        >
                          Title
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                        >
                          Difficulty
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider"
                        >
                          Tags
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-gray-700">
                      {currentProblems.length > 0 ? (
                        currentProblems.map((problem, index) => (
                          <motion.tr 
                            key={problem.id} 
                            className="hover:bg-[var(--primary)] hover:bg-opacity-50 transition-colors cursor-pointer"
                            onClick={() => handleProblemClick(problem.id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
                            whileHover={{ 
                              backgroundColor: "rgba(30, 30, 46, 0.8)",
                              transition: { duration: 0.2 }
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <motion.div 
                                className={`w-3 h-3 rounded-full ${
                                  solvedProblems.includes(problem.id) 
                                    ? 'bg-green-400' 
                                    : 'bg-gray-600'
                                }`}
                                whileHover={{ scale: 1.5 }}
                                transition={{ duration: 0.2 }}
                              ></motion.div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] group flex items-center">
                                {problem.title}
                                <motion.div
                                  className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1"
                                  transition={{ duration: 0.3 }}
                                >
                                  <ArrowRight size={16} />
                                </motion.div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <motion.span 
                                className={`${getDifficultyColor(problem.difficulty)}`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {problem.difficulty}
                              </motion.span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {problem.tags.map((tag, tagIndex) => (
                                  <motion.span 
                                    key={tagIndex} 
                                    className="bg-[var(--primary)] text-xs px-2 py-1 rounded"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 30, 60, 0.8)" }}
                                  >
                                    {tag}
                                  </motion.span>
                                ))}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                            No problems found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {filteredProblems.length > 0 && (
                  <div className="flex items-center justify-between border-t border-gray-700 px-6 py-4 mt-4">
                    <div className="text-sm text-[var(--text-secondary)]">
                      Showing <span className="font-medium">{indexOfFirstProblem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastProblem, filteredProblems.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredProblems.length}</span> problems
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full ${
                          currentPage === 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-[var(--text)] hover:bg-[var(--primary)]'
                        }`}
                        whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                        whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                      >
                        <ChevronLeft size={20} />
                      </motion.button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <motion.button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentPage === pageNum
                                ? 'bg-[var(--accent)] text-white'
                                : 'text-[var(--text)] hover:bg-[var(--primary)]'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                      
                      <motion.button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full ${
                          currentPage === totalPages
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-[var(--text)] hover:bg-[var(--primary)]'
                        }`}
                        whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                        whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CodePage;