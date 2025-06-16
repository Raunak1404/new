import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, Code, FileCode, List, ChevronRight, Flag, Check, Award, Star, Lock, Map, CheckCircle, AlertCircle, MapPin, Play, Zap, X, ArrowRight, LifeBuoy, Gift, BookMarked, Brain, Send, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { getTopicById } from '../data/studyTopics';
import { codingProblems } from '../data/codingProblems';
import { useAuth } from '../context/AuthContext';

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

// Map icon names to lucide-react components
const getIconComponent = (iconName: string, size: number = 28) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Code': <Code size={size} />,
    'ListTree': <List size={size} />,
    'FileText': <FileCode size={size} />,
    'BarChart2': <BarChart2 size={size} />,
    'Network': <Network size={size} />,
    'Layers': <Layers size={size} />,
    'GitBranch': <GitBranch size={size} />
  };
  
  return iconMap[iconName] || <BookOpen size={size} />;
};

// Import necessary icons
import { 
  BarChart2, 
  Network, 
  Layers, 
  GitBranch 
} from 'lucide-react';

// Define milestone interface
interface Milestone {
  id: number;
  title: string;
  type: 'section' | 'practice';
  completed: boolean;
  locked: boolean;
  sectionIndex?: number;
  problemIds?: number[];
  requiredProblems?: number; // Number of problems that must be solved
  solvedProblems?: number[]; // IDs of solved problems
}

interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

// Simplified floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[var(--accent)] opacity-10"
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%` 
          }}
          animate={{ 
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Milestone completion confetti effect
const Confetti = ({ isVisible }: { isVisible: boolean }) => {
  return isVisible ? (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          initial={{ 
            top: "-10%",
            left: `${Math.random() * 100}%`,
            backgroundColor: [
              "#f45b69", "#00d4ff", "#FFD700", "#FF69B4", "#00FF00",
              "#1E90FF", "#FF4500", "#9370DB", "#00FFFF"
            ][Math.floor(Math.random() * 9)]
          }}
          animate={{ 
            top: "110%",
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 2.5 + Math.random() * 2.5,
            ease: "easeOut"
          }}
          style={{
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`
          }}
        />
      ))}
    </div>
  ) : null;
};

// Floating achievement notification
const AchievementNotification = ({ achievement, onClose }: { achievement: string, onClose: () => void }) => {
  return (
    <motion.div
      className="fixed top-20 right-0 z-50 max-w-xs"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="bg-gradient-to-r from-[var(--secondary)] to-[#1a1a3e] p-4 rounded-l-lg shadow-xl border-l-4 border-[var(--accent)] m-4">
        <div className="flex items-start">
          <div className="bg-[var(--accent)] bg-opacity-20 rounded-full p-2 mr-3">
            <Star className="text-[var(--accent)]" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">Achievement Unlocked!</h4>
            <p className="text-xs text-[var(--text-secondary)]">{achievement}</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Progress path that connects milestones
const ProgressPath = ({ progress, milestones }: { progress: number, milestones: Milestone[] }) => {
  return (
    <div className="relative h-1 bg-gray-700 rounded mb-6">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      
      {milestones.map((_, index) => {
        const position = (index / (milestones.length - 1)) * 100;
        const isActive = progress >= position;
        
        return (
          <motion.div 
            key={index}
            className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ${
              isActive ? 'bg-[var(--accent)]' : 'bg-gray-600'
            }`}
            style={{ left: `${position}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          />
        );
      })}
    </div>
  );
};

const TopicPage = () => {
  const { topic } = useParams<{ topic: string }>();
  const topicData = topic ? getTopicById(topic) : null;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [currentPracticeProblems, setCurrentPracticeProblems] = useState<any[]>([]);
  const [journeyProgress, setJourneyProgress] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showTestResult, setShowTestResult] = useState<boolean>(false);
  const [testPassed, setTestPassed] = useState<boolean>(false);
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [celebrationText, setCelebrationText] = useState<string>("");
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [answerTime, setAnswerTime] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentTestQuestions, setCurrentTestQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showRequiredMessage, setShowRequiredMessage] = useState<boolean>(false);
  const [pulseMilestone, setPulseMilestone] = useState<number | null>(null);
  const [practiceProblemSolved, setPracticeProblemSolved] = useState<boolean>(false);

  // Generate quiz questions based on section
  const generateQuestions = (sectionIndex: number): TestQuestion[] => {
    if (!topicData) return [];
    
    const section = topicData.sections[sectionIndex];
    if (!section) return [];
    
    // Create questions based on section content
    return [
      {
        id: 1,
        question: `Which of the following best describes the main focus of "${section.title}"?`,
        options: [
          `Understanding core concepts of ${section.title}`,
          `Advanced applications of ${section.title}`,
          `Historical development of ${section.title}`,
          `Comparing ${section.title} with other approaches`
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: `According to the material, what is one key characteristic of ${section.title.toLowerCase()}?`,
        options: [
          `It has O(n²) complexity in most cases`,
          `It can only be applied to sorted data structures`,
          `It requires recursive implementation`,
          `It helps solve problems by breaking them into smaller parts`
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: `Which of these would be a typical use case for techniques described in this section?`,
        options: [
          `Database indexing`,
          `Natural language processing`,
          `Problem solving with optimal solutions`,
          `Hardware acceleration`
        ],
        correctAnswer: 2
      }
    ];
  };

  // Generate milestones based on topic sections and practice problems
  useEffect(() => {
    if (!topicData) return;

    const newMilestones: Milestone[] = [];
    
    // Create a milestone for each section
    topicData.sections.forEach((section, index) => {
      // Section milestone
      newMilestones.push({
        id: index * 2,
        title: section.title,
        type: 'section',
        completed: false,
        locked: index > 0, // First section is unlocked
        sectionIndex: index
      });
      
      // Practice milestone after each section
      newMilestones.push({
        id: index * 2 + 1,
        title: `Practice: ${section.title}`,
        type: 'practice',
        completed: false,
        locked: true,
        problemIds: getProblemsForSection(index, 3), // Get 3 related problems
        requiredProblems: 1, // Need to solve at least one problem
        solvedProblems: []
      });
    });
    
    // Set initial milestone completion based on local storage (simplified)
    const savedProgress = localStorage.getItem(`study-progress-${topic}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const progressIndex = Math.min(progress.milestoneIndex || 0, newMilestones.length - 1);
        
        // Update milestone completion states
        for (let i = 0; i <= progressIndex; i++) {
          newMilestones[i].completed = true;
          if (i + 1 < newMilestones.length) {
            newMilestones[i + 1].locked = false;
          }
        }
        
        // Set active milestone
        setActiveMilestone(progressIndex);
        // Calculate journey progress percentage
        setJourneyProgress(Math.ceil((progressIndex + 1) / newMilestones.length * 100));
      } catch (e) {
        console.error("Error parsing saved progress:", e);
      }
    } else {
      // No saved progress, start at the beginning
      setJourneyProgress(Math.ceil(1 / newMilestones.length * 100));
    }
    
    setMilestones(newMilestones);
  }, [topicData, topic]);

  // Get problems for section practice
  const getProblemsForSection = (sectionIndex: number, count: number): number[] => {
    if (!topicData) return [];
    
    // Calculate start and end index based on section position
    const totalProblems = topicData.practiceProblems.length;
    const problemsPerSection = Math.max(1, Math.floor(totalProblems / topicData.sections.length));
    
    const start = sectionIndex * problemsPerSection;
    const end = Math.min(start + count, totalProblems);
    
    // Get problem IDs from the practice problems array
    return topicData.practiceProblems
      .slice(start, end)
      .map(p => p.id);
  };

  // Handle section completion
  const handleSectionComplete = () => {
    if (!topicData) return;
    
    const currentMilestone = milestones[activeMilestone];
    
    // Can only complete section milestones
    if (currentMilestone.type !== 'section' || currentMilestone.completed) return;

    // Create questions for the test
    const questions = generateQuestions(currentMilestone.sectionIndex || 0);
    setCurrentTestQuestions(questions);
    setCurrentQuestionIndex(0);
    setShowPracticeModal(true);
    
    // Get practice problems for this section
    if (currentMilestone.sectionIndex !== undefined) {
      const problemIds = getProblemsForSection(currentMilestone.sectionIndex, 3);
      const problems = problemIds.map(id => codingProblems.find(p => p.id === id)).filter(Boolean);
      setCurrentPracticeProblems(problems as any[]);
    }
    
    setQuestionStartTime(Date.now());
  };

  // Check if all test questions are answered correctly
  const areAllQuestionsAnsweredCorrectly = () => {
    return currentTestQuestions.every(q => q.userAnswer === q.correctAnswer);
  };

  // Handle practice completion
  const handlePracticeComplete = () => {
    if (!topicData) return;
    
    const currentMilestone = milestones[activeMilestone];
    
    // Can only complete practice milestones
    if (currentMilestone.type !== 'practice' || currentMilestone.completed) return;
    
    // Check if the required number of problems have been solved
    if (!practiceProblemSolved) {
      setShowRequiredMessage(true);
      return;
    }
    
    // Play completion animation
    setShowConfetti(true);
    setAchievement(`Completed ${currentMilestone.title}!`);
    setTimeout(() => setShowConfetti(false), 3000);
    
    const updatedMilestones = [...milestones];
    
    // Mark current milestone as completed
    updatedMilestones[activeMilestone].completed = true;
    
    // Unlock next milestone
    if (activeMilestone + 1 < updatedMilestones.length) {
      updatedMilestones[activeMilestone + 1].locked = false;
      
      // Pulse animation for next milestone
      setPulseMilestone(activeMilestone + 1);
      setTimeout(() => setPulseMilestone(null), 3000);
      
      setActiveMilestone(activeMilestone + 1);
    } else {
      // Completed all milestones
      setShowCompletionModal(true);
    }
    
    // Update state
    setMilestones(updatedMilestones);
    
    // Calculate new progress percentage
    const newProgress = Math.ceil((activeMilestone + 2) / updatedMilestones.length * 100);
    setJourneyProgress(Math.min(newProgress, 100));
    
    // Save progress in local storage
    saveProgress(activeMilestone + 1);

    // Close the practice modal
    setShowPracticeModal(false);
    
    // Reset solved practice problem flag
    setPracticeProblemSolved(false);
  };

  // Success celebration after answering correctly
  const showCelebration = () => {
    setIsAnimating(true);
    setCelebrationText("Correct! Great job!");
    
    setTimeout(() => {
      setIsAnimating(false);
      setCelebrationText("");
    }, 2000);
  };

  // Save progress to local storage
  const saveProgress = (milestoneIndex: number) => {
    localStorage.setItem(`study-progress-${topic}`, JSON.stringify({
      milestoneIndex,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Handle milestone click
  const handleMilestoneClick = (index: number) => {
    const milestone = milestones[index];
    
    // Cannot interact with locked milestones
    if (milestone.locked) return;
    
    // Set active milestone
    setActiveMilestone(index);
    
    // For section type, also set the active section
    if (milestone.type === 'section' && milestone.sectionIndex !== undefined) {
      setActiveSection(milestone.sectionIndex);
    }
    
    // For practice type, show practice modal if not completed
    if (milestone.type === 'practice' && !milestone.completed) {
      setShowPracticeModal(true);
      if (milestone.problemIds) {
        const problems = milestone.problemIds
          .map(id => codingProblems.find(p => p.id === id))
          .filter(Boolean);
        setCurrentPracticeProblems(problems as any[]);
      }
    }
    
    // Animate scroll to the new content
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle test question answer
  const handleAnswerQuestion = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...currentTestQuestions];
    updatedQuestions[questionIndex].userAnswer = answerIndex;
    setCurrentTestQuestions(updatedQuestions);
    
    // Calculate answer time
    const answerTimeMs = Date.now() - (questionStartTime || Date.now());
    setAnswerTime(Math.floor(answerTimeMs / 1000));
    
    // If this was the last question, evaluate the test
    if (questionIndex === currentTestQuestions.length - 1) {
      setTimeout(() => {
        const allCorrect = areAllQuestionsAnsweredCorrectly();
        setTestPassed(allCorrect);
        setShowTestResult(true);
        
        if (allCorrect) {
          // Complete section if all questions are correct
          const updatedMilestones = [...milestones];
          updatedMilestones[activeMilestone].completed = true;
          
          // Unlock next milestone (practice problems)
          if (activeMilestone + 1 < updatedMilestones.length) {
            updatedMilestones[activeMilestone + 1].locked = false;
          }
          
          setMilestones(updatedMilestones);
          
          // Save progress
          saveProgress(activeMilestone);
        }
      }, 500);
    } else {
      // Move to the next question with animation
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    }
  };

  // Handle practice problem completion by simulating a problem being solved
  const handleProblemSolved = () => {
    // In real implementation, you'd verify the solution from backend
    // For now, just mark as solved
    const currentMilestone = milestones[activeMilestone];
    
    if (currentMilestone.type !== 'practice') return;
    
    const updatedMilestones = [...milestones];
    
    if (!updatedMilestones[activeMilestone].solvedProblems) {
      updatedMilestones[activeMilestone].solvedProblems = [];
    }
    
    // Add the first problem ID to the solved list
    if (currentMilestone.problemIds && currentMilestone.problemIds.length > 0) {
      updatedMilestones[activeMilestone].solvedProblems?.push(currentMilestone.problemIds[0]);
    }
    
    setMilestones(updatedMilestones);
    setPracticeProblemSolved(true);
    
    // Show achievement
    setAchievement("Problem Solver: You completed a coding challenge!");
    
    // Hide message after a delay
    setTimeout(() => {
      setAchievement(null);
    }, 3000);
  };

  // Check if the milestone is the active one
  const isActiveMilestone = (index: number) => {
    return activeMilestone === index;
  };

  if (!topicData) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Topic not found</p>
              <Link
                to="/study"
                className="mt-4 flex items-center text-[var(--accent)] hover:underline"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to study materials
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

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
              ref={containerRef}
            >
              {/* Header with title and back button */}
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center">
                  <div className="mr-3 text-[var(--accent)]">
                    {getIconComponent(topicData.icon)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{topicData.title}</h1>
                    <div className="flex items-center text-sm text-[var(--text-secondary)]">
                      <Map size={14} className="mr-1" />
                      <span>Learning Journey</span>
                      <span className="mx-2">•</span>
                      <span>{journeyProgress}% Complete</span>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/study"
                  className="flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)]"
                >
                  <ArrowLeft size={20} className="mr-1" />
                  Back to topics
                </Link>
              </div>
              
              {/* Learning Journey Progress Bar */}
              <div className="card p-6 mb-8 relative overflow-hidden">
                <FloatingParticles />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center">
                    <BookMarked className="text-[var(--accent)] mr-2" size={22} />
                    <h2 className="text-xl font-bold">Your Learning Journey</h2>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {journeyProgress}% completed
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="relative h-8 bg-[var(--primary)] rounded-lg mb-8 overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${journeyProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                
                {/* Milestone journey path */}
                <div className="relative mb-8">
                  {/* Path line */}
                  <div className="absolute top-10 left-0 right-0 h-1 bg-gray-700 z-0">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(100, (activeMilestone / (milestones.length - 1)) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  
                  {/* Milestones */}
                  <div className="flex justify-between relative">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className={`relative flex flex-col items-center ${
                          milestone.locked ? 'opacity-50' : 'cursor-pointer hover:scale-105 transition-transform'
                        }`}
                        onClick={() => !milestone.locked && handleMilestoneClick(index)}
                      >
                        {/* Milestone icon */}
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                            milestone.completed 
                              ? 'bg-green-500 text-white' 
                              : isActiveMilestone(index)
                                ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)] ring-opacity-30'
                                : 'bg-[var(--primary)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {milestone.locked ? (
                            <Lock size={18} />
                          ) : milestone.completed ? (
                            <Check size={18} />
                          ) : milestone.type === 'section' ? (
                            <BookOpen size={18} />
                          ) : (
                            <Code size={18} />
                          )}
                        </div>
                        
                        {/* Milestone label */}
                        <div 
                          className={`absolute mt-14 text-xs text-center w-24 ${
                            isActiveMilestone(index) ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {milestone.type === 'section' ? 'Learn' : 'Practice'}
                          <span className="block font-semibold">
                            {milestone.type === 'section' 
                              ? `Section ${(milestone.sectionIndex || 0) + 1}` 
                              : `Checkpoint ${Math.floor(index / 2) + 1}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Progress path visualization */}
                <ProgressPath progress={journeyProgress} milestones={milestones} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                {/* Background animated gradient */}
                <div className="absolute -top-10 -right-20 w-64 h-64 bg-[var(--accent)] rounded-full filter blur-[120px] opacity-10 z-0"></div>
                
                {/* Table of Contents Sidebar */}
                <div className="lg:col-span-3 relative z-10">
                  <div className="card sticky top-24 z-10">
                    <div className="flex items-center mb-4">
                      <MapPin className="text-[var(--accent)] mr-2" size={18} />
                      <h2 className="text-lg font-semibold">Journey Milestones</h2>
                    </div>
                    
                    <ul className="space-y-2">
                      {milestones.map((milestone, index) => (
                        <li key={index}>
                          <button
                            onClick={() => !milestone.locked && handleMilestoneClick(index)}
                            disabled={milestone.locked}
                            className={`text-left w-full py-2 px-3 rounded-lg text-sm transition-colors flex items-center ${
                              milestone.locked
                                ? 'opacity-50 cursor-not-allowed'
                                : isActiveMilestone(index)
                                  ? 'bg-[var(--accent)] bg-opacity-20 text-[var(--accent)]'
                                  : 'hover:bg-[var(--primary)]'
                            }`}
                          >
                            {milestone.locked ? (
                              <Lock size={16} className="mr-2 flex-shrink-0" />
                            ) : milestone.completed ? (
                              <CheckCircle size={16} className="mr-2 flex-shrink-0 text-green-500" />
                            ) : (
                              <div
                                className={`w-4 h-4 rounded-full mr-2 flex-shrink-0 ${
                                  isActiveMilestone(index) ? 'bg-[var(--accent)]' : 'bg-[var(--primary)]'
                                }`}
                              />
                            )}
                            <span className="line-clamp-1">
                              {milestone.type === 'section' 
                                ? `Learn: ${milestone.title}` 
                                : `Practice: Checkpoint ${Math.floor(index / 2) + 1}`}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h3 className="text-sm font-semibold mb-2">Your Progress</h3>
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>{journeyProgress}% complete</span>
                        <span>{milestones.filter(m => m.completed).length}/{milestones.length} milestones</span>
                      </div>
                      <div className="w-full bg-[var(--primary)] h-2 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${journeyProgress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="lg:col-span-9 space-y-6 relative z-10">
                  {/* Active Section Content */}
                  {milestones[activeMilestone]?.type === 'section' && milestones[activeMilestone]?.sectionIndex !== undefined && (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                      >
                        <div className="card relative overflow-hidden">
                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <h2 className="text-2xl font-bold mb-1">{topicData.sections[activeSection].title}</h2>
                              <div className="text-sm text-[var(--text-secondary)] mb-4">
                                <span>Section {activeSection + 1} of {topicData.sections.length}</span>
                                <span className="mx-2">•</span>
                                <span>Milestone {activeMilestone + 1} of {milestones.length}</span>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              milestones[activeMilestone].completed 
                                ? 'bg-green-500 bg-opacity-20 text-green-500' 
                                : 'bg-[var(--accent)] bg-opacity-20 text-[var(--accent)]'
                            }`}>
                              {milestones[activeMilestone].completed ? 'Completed' : 'In Progress'}
                            </div>
                          </div>
                          
                          <div className="prose prose-invert max-w-none">
                            <p className="whitespace-pre-line">{topicData.sections[activeSection].content}</p>
                          </div>
                        </div>
                        
                        {topicData.sections[activeSection].examples && topicData.sections[activeSection].examples.length > 0 && (
                          <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Examples</h3>
                            {topicData.sections[activeSection].examples.map((example, idx) => (
                              <div key={idx} className="mb-4">
                                <div className="flex items-center mb-2 text-sm text-[var(--text-secondary)]">
                                  <FileCode size={16} className="mr-1" />
                                  {example.language}
                                </div>
                                <div className="bg-[var(--primary)] p-4 rounded-lg overflow-x-auto">
                                  <pre className="text-sm font-mono">{example.code}</pre>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* "Mark as Completed" button */}
                        {!milestones[activeMilestone].completed && (
                          <div className="flex justify-end">
                            <button
                              onClick={handleSectionComplete}
                              className="btn-primary flex items-center"
                            >
                              <CheckCircle size={18} className="mr-2" />
                              Complete and Take Quiz
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                  
                  {/* Practice Content */}
                  {milestones[activeMilestone]?.type === 'practice' && (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`practice-${activeMilestone}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="card relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500 filter blur-[80px] opacity-10 z-0"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div>
                            <div className="flex items-center">
                              <Brain className="text-[var(--accent)] mr-2" size={22} />
                              <h2 className="text-2xl font-bold mb-1">Practice: Checkpoint {Math.floor(activeMilestone / 2) + 1}</h2>
                            </div>
                            <p className="text-[var(--text-secondary)]">
                              Apply what you've learned by solving these problems
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            milestones[activeMilestone].completed 
                              ? 'bg-green-500 bg-opacity-20 text-green-500' 
                              : 'bg-[var(--accent)] bg-opacity-20 text-[var(--accent)]'
                          }`}>
                            {milestones[activeMilestone].completed ? 'Completed' : 'In Progress'}
                          </div>
                        </div>
                        
                        {/* Practice intro */}
                        <div className="bg-[var(--primary)] p-4 rounded-lg mb-6">
                          <div className="flex items-start">
                            <Flag size={24} className="text-[var(--accent)] mr-3 mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium mb-1">Checkpoint Challenge</h3>
                              <p className="text-sm text-[var(--text-secondary)]">
                                Complete at least one practice problem to apply what you've learned in the previous section.
                                Solving these problems will reinforce your understanding and help you build problem-solving skills.
                              </p>
                              
                              {practiceProblemSolved && (
                                <p className="mt-2 text-sm text-green-400 flex items-center">
                                  <CheckCircle size={16} className="mr-1" />
                                  You've completed a problem! You can now proceed.
                                </p>
                              )}
                              
                              {showRequiredMessage && !practiceProblemSolved && (
                                <p className="mt-2 text-sm text-red-400 flex items-center">
                                  <AlertCircle size={16} className="mr-1" />
                                  Please solve at least one problem to proceed.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Practice problems */}
                        <div className="space-y-4 mb-6">
                          {milestones[activeMilestone].problemIds?.map((problemId, idx) => {
                            const problem = codingProblems.find(p => p.id === problemId);
                            if (!problem) return null;
                            
                            return (
                              <div key={idx} className="group">
                                <Link 
                                  to={`/code/${problem.id}`}
                                  className="flex items-center justify-between p-4 bg-[var(--primary)] rounded-lg hover:bg-opacity-80 transition-colors"
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-[var(--secondary)] rounded-full flex items-center justify-center mr-4 text-[var(--accent)]">
                                      <Code size={18} />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{problem.title}</h4>
                                      <div className="flex items-center text-xs mt-1">
                                        <span className={getDifficultyColor(problem.difficulty)}>
                                          {problem.difficulty}
                                        </span>
                                        <span className="mx-2 text-[var(--text-secondary)]">•</span>
                                        <span className="text-[var(--text-secondary)]">
                                          {problem.tags.slice(0, 2).join(', ')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    {/* If problem is solved, show indicator */}
                                    {milestones[activeMilestone].solvedProblems?.includes(problemId) && (
                                      <span className="mr-3 text-green-400 flex items-center">
                                        <CheckCircle size={16} className="mr-1" />
                                        <span className="text-xs">Solved</span>
                                      </span>
                                    )}
                                    <ChevronRight size={20} className="text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Problem completion button (for demo purposes) */}
                        <div className="bg-[var(--primary)] p-4 rounded-lg mb-6">
                          <h3 className="font-medium mb-3">Demo: Mark Problem as Solved</h3>
                          <p className="text-sm text-[var(--text-secondary)] mb-3">
                            In a real implementation, this would be automatically detected when you submit a correct solution to a problem.
                            For demonstration purposes, click the button below to simulate solving a problem.
                          </p>
                          <button
                            onClick={handleProblemSolved}
                            className="btn-secondary flex items-center text-sm"
                            disabled={practiceProblemSolved}
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Simulate Problem Solved
                          </button>
                        </div>
                        
                        {/* Practice completion button */}
                        <div className="flex justify-end">
                          <button
                            onClick={handlePracticeComplete}
                            className={`btn-primary flex items-center ${!practiceProblemSolved ? 'opacity-70' : ''}`}
                          >
                            {practiceProblemSolved ? (
                              <>
                                <ArrowRight size={18} className="mr-2" />
                                Continue Journey
                              </>
                            ) : (
                              <>
                                <AlertCircle size={18} className="mr-2" />
                                Complete a Problem to Continue
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  
                  {/* Navigation Controls */}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => {
                        const prevMilestone = milestones.findIndex((m, i) => 
                          i < activeMilestone && !m.locked
                        );
                        if (prevMilestone >= 0) {
                          handleMilestoneClick(prevMilestone);
                        }
                      }}
                      className={`btn-secondary flex items-center ${
                        !milestones.some((m, i) => i < activeMilestone && !m.locked) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                      disabled={!milestones.some((m, i) => i < activeMilestone && !m.locked)}
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        const nextIndex = milestones.findIndex((m, i) => 
                          i > activeMilestone && !m.locked
                        );
                        if (nextIndex >= 0) {
                          handleMilestoneClick(nextIndex);
                        }
                      }}
                      className={`btn-primary flex items-center ${
                        !milestones.some((m, i) => i > activeMilestone && !m.locked) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                      disabled={!milestones.some((m, i) => i > activeMilestone && !m.locked)}
                    >
                      Next
                      <ArrowLeft size={16} className="ml-2 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Quiz/Practice Test Modal */}
      {showPracticeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="bg-[var(--secondary)] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--accent)] filter blur-[80px] opacity-10 z-0"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center">
                <Brain className="text-[var(--accent)] mr-2" size={24} />
                <h2 className="text-2xl font-bold">Knowledge Check: {topicData.sections[Math.floor(activeMilestone / 2)].title}</h2>
              </div>
              <button 
                onClick={() => setShowPracticeModal(false)}
                className="text-[var(--text-secondary)] hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-[var(--text-secondary)] mb-6 relative z-10">
              This quiz will test your understanding of {topicData.sections[Math.floor(activeMilestone / 2)].title}.
              Answer all questions correctly to proceed to the practice problems.
            </p>
            
            {!showTestResult ? (
              <div className="space-y-6 relative z-10">
                {/* Test questions */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`question-${currentQuestionIndex}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-[var(--primary)] p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Question {currentQuestionIndex + 1} of {currentTestQuestions.length}</h3>
                        <div className="flex items-center text-[var(--text-secondary)] text-xs">
                          <Clock size={14} className="mr-1" />
                          {questionStartTime ? (
                            <span>Started {Math.floor((Date.now() - questionStartTime) / 1000)}s ago</span>
                          ) : (
                            <span>Timer starts when you select an answer</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="font-medium mb-4">
                        {currentTestQuestions[currentQuestionIndex]?.question}
                      </p>
                      
                      <div className="space-y-3">
                        {currentTestQuestions[currentQuestionIndex]?.options.map((option, idx) => (
                          <button
                            key={idx}
                            className={`w-full text-left p-3 rounded-lg border ${
                              currentTestQuestions[currentQuestionIndex]?.userAnswer === idx
                                ? 'bg-[var(--accent)] bg-opacity-20 border-[var(--accent)]'
                                : 'bg-[var(--secondary)] border-gray-700 hover:bg-[var(--secondary)] hover:bg-opacity-70'
                            }`}
                            onClick={() => handleAnswerQuestion(currentQuestionIndex, idx)}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                currentTestQuestions[currentQuestionIndex]?.userAnswer === idx
                                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                                  : 'border-gray-500'
                              }`}>
                                {currentTestQuestions[currentQuestionIndex]?.userAnswer === idx && (
                                  <Check size={12} />
                                )}
                              </div>
                              {option}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-[var(--text-secondary)]">
                        {currentQuestionIndex + 1} of {currentTestQuestions.length} questions
                      </div>
                      <div className="w-32 h-2 bg-[var(--primary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--accent)]"
                          style={{ width: `${((currentQuestionIndex + 1) / currentTestQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Celebration animation when answering */}
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-2xl font-bold text-white"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {celebrationText}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8 relative z-10">
                {testPassed ? (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle size={64} className="mx-auto text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-500">
                      Quiz Passed!
                    </h3>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                      Congratulations! You've successfully completed this knowledge check.
                      You answered all questions correctly in {answerTime} seconds.
                      You can now proceed to the practice problems.
                    </p>
                    <button
                      onClick={() => {
                        setShowPracticeModal(false);
                        const practiceIndex = activeMilestone + 1;
                        if (practiceIndex < milestones.length && !milestones[practiceIndex].locked) {
                          handleMilestoneClick(practiceIndex);
                        }
                      }}
                      className="btn-primary mt-4"
                    >
                      Continue to Practice Problems
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <AlertCircle size={64} className="mx-auto text-red-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-red-500">
                      Quiz Failed
                    </h3>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                      You didn't pass all the required questions.
                      Review the material and try again.
                    </p>
                    <button
                      onClick={() => {
                        setShowTestResult(false);
                        setCurrentQuestionIndex(0);
                        // Reset user answers
                        setCurrentTestQuestions(prev => 
                          prev.map(q => ({ ...q, userAnswer: undefined }))
                        );
                      }}
                      className="btn-secondary mt-4"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Topic Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--secondary)] rounded-xl p-8 max-w-md w-full text-center relative overflow-hidden"
          >
            <motion.div 
              className="w-24 h-24 rounded-full bg-[var(--accent)] bg-opacity-20 mx-auto flex items-center justify-center mb-6 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
            >
              <Award size={48} className="text-[var(--accent)]" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4 relative z-10">
              Topic Mastered!
            </h2>
            
            <p className="text-[var(--text-secondary)] mb-6 relative z-10">
              Congratulations! You've completed all sections and practice exercises for {topicData.title}.
              You've demonstrated a strong understanding of this topic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button
                onClick={() => navigate('/study')}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                <BookOpen size={18} className="mr-2" />
                Explore More Topics
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <Star size={18} className="mr-2" />
                Review This Topic
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Confetti animation */}
      <Confetti isVisible={showConfetti} />
      
      {/* Achievement notification */}
      <AnimatePresence>
        {achievement && (
          <AchievementNotification 
            achievement={achievement} 
            onClose={() => setAchievement(null)} 
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default TopicPage;