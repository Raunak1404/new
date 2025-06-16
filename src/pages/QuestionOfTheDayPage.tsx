import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, Clock, Award, Package, Sparkles, Gift, Star, Zap, CheckCircle, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { getProblemById, codingProblems } from '../data/codingProblems';
import { useAuth } from '../context/AuthContext';

// Get a daily problem based on the current date
const getDailyProblem = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Use the seed to consistently select the same problem for the whole day
  const randomIndex = seed % codingProblems.length;
  return codingProblems[randomIndex] || codingProblems[0];
};

// Mock data for previous winners
const previousWinners = [
  { name: "Alex Chen", time: "05:42", rank: 1 },
  { name: "Maria Rodriguez", time: "06:13", rank: 2 },
  { name: "Jordan Lee", time: "07:01", rank: 3 },
];

// Confetti animation component
const Confetti = ({ isVisible }: { isVisible: boolean }) => {
  return isVisible ? (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {Array.from({ length: 100 }).map((_, i) => (
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
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
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

const QuestionOfTheDayPage = () => {
  const { currentUser } = useAuth();
  const [questionOfTheDay, setQuestionOfTheDay] = useState(getDailyProblem());
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [isBoxShaking, setIsBoxShaking] = useState(false);
  const [unboxProgress, setUnboxProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [particles, setParticles] = useState<{x: number, y: number, size: number, color: string, speed: number}[]>([]);
  const [boxRotation, setBoxRotation] = useState(0);
  const [isBoxGlowing, setIsBoxGlowing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardCollected, setRewardCollected] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  
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

  // Calculate and update time remaining until the next day
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ hours, minutes, seconds });
    };

    // Update immediately then set interval
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Create initial particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: ['#f45b69', '#00d4ff', '#FFD700'][Math.floor(Math.random() * 3)],
      speed: Math.random() * 2 + 0.5
    }));
    
    setParticles(newParticles);
  }, []);

  // Handle box click animation
  const handleBoxClick = (e: React.MouseEvent) => {
    if (isBoxOpened) return;
    
    // Update click count
    setClickCount(prev => prev + 1);
    
    // Create click particles at cursor position
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Add new particles at click position
      const newParticles = [...particles];
      for (let i = 0; i < 5; i++) {
        newParticles.push({
          x,
          y,
          size: Math.random() * 6 + 3,
          color: ['#f45b69', '#00d4ff', '#FFD700'][Math.floor(Math.random() * 3)],
          speed: Math.random() * 3 + 1
        });
      }
      setParticles(newParticles);
    }
    
    // Shake animation
    setIsBoxShaking(true);
    setTimeout(() => {
      setIsBoxShaking(false);
    }, 700);
    
    // Rotate box slightly with each click
    setBoxRotation(prev => prev + (Math.random() * 10 - 5));
    
    // Increase the progress with each click
    if (unboxProgress < 100) {
      const increment = Math.min(25, 100 - unboxProgress);
      setUnboxProgress(prev => prev + increment);
    }
    
    // Glow effect as progress increases
    if (unboxProgress >= 50) {
      setIsBoxGlowing(true);
      setTimeout(() => setIsBoxGlowing(false), 800);
    }
    
    // Open the box when progress is complete
    if (unboxProgress >= 75) {
      setTimeout(() => {
        setIsBoxOpened(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowReward(true);
        }, 3000);
      }, 500);
    }
  };

  // Handle reward collection
  const handleCollectReward = () => {
    setRewardCollected(true);
    setTimeout(() => {
      setShowReward(false);
    }, 1000);
  };

  if (!questionOfTheDay) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">No question available for today</p>
              <Link
                to="/code"
                className="mt-4 flex items-center text-[var(--accent)] hover:underline justify-center"
              >
                <span>Browse all problems</span>
                <ChevronRight size={16} className="ml-1" />
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
            >
              <div className="flex items-center mb-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <Calendar className="text-[var(--accent)] mr-3" size={28} />
                </motion.div>
                <h1 className="text-3xl font-bold">Question of the Day</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Question Card */}
                <div className="md:col-span-2 space-y-6">
                  <motion.div 
                    className="card relative overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="wait">
                      {!isBoxOpened ? (
                        <motion.div 
                          className="flex flex-col items-center justify-center py-10"
                          key="unopened-box"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div 
                            className="relative mb-8 cursor-pointer"
                            onClick={handleBoxClick}
                            ref={boxRef}
                          >
                            <motion.div 
                              className="w-48 h-48 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden"
                              animate={{ 
                                rotate: boxRotation,
                                boxShadow: isBoxGlowing ? "0 0 30px rgba(244, 91, 105, 0.6)" : "0 0 15px rgba(244, 91, 105, 0.3)"
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.div
                                animate={isBoxShaking ? {
                                  x: [0, -10, 10, -10, 10, 0],
                                  y: [0, -5, 5, -5, 5, 0],
                                  transition: { duration: 0.7 }
                                } : {}}
                              >
                                <Package size={80} className="text-white" />
                              </motion.div>
                              
                              {/* Animated particles */}
                              {particles.map((particle, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute rounded-full"
                                  animate={{
                                    x: [`${particle.x}%`, `${particle.x + (Math.random() * 40 - 20)}%`],
                                    y: [`${particle.y}%`, `${particle.y + (Math.random() * 40 - 20)}%`],
                                    opacity: [0.7, 0]
                                  }}
                                  transition={{
                                    duration: particle.speed,
                                    ease: "linear",
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                  }}
                                  style={{
                                    width: particle.size,
                                    height: particle.size,
                                    backgroundColor: particle.color
                                  }}
                                />
                              ))}
                              
                              {unboxProgress > 0 && (
                                <motion.div 
                                  className="absolute top-0 left-0 right-0 bottom-0 bg-white/10 backdrop-blur-sm"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: unboxProgress / 200 }}
                                  transition={{ duration: 0.5 }}
                                />
                              )}
                            </motion.div>
                            
                            {/* Glow effect */}
                            <motion.div
                              className="absolute -inset-2 bg-[var(--accent)] rounded-xl opacity-30 blur-lg"
                              animate={{ 
                                opacity: isBoxGlowing ? [0.3, 0.6, 0.3] : 0.3,
                                scale: isBoxGlowing ? [1, 1.1, 1] : 1
                              }}
                              transition={{ duration: 0.8 }}
                            />
                          </motion.div>
                          
                          <motion.h2 
                            className="text-2xl font-bold mb-4"
                            animate={{ scale: clickCount % 5 === 0 && clickCount > 0 ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            Today's Coding Challenge
                          </motion.h2>
                          
                          <div className="w-full max-w-md bg-[var(--primary)] h-4 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${unboxProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          
                          <motion.p 
                            className="mt-4 text-[var(--text-secondary)]"
                            animate={{ 
                              opacity: [0.7, 1, 0.7],
                              y: [0, -2, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            {unboxProgress === 0 ? 'Click the box to reveal today\'s challenge!' :
                             unboxProgress < 50 ? 'Keep clicking to open the box!' : 
                             unboxProgress < 100 ? 'Almost there!' : 
                             'Revealing challenge...'}
                          </motion.p>
                        </motion.div>
                      ) : showReward && !rewardCollected ? (
                        <motion.div
                          key="reward"
                          className="flex flex-col items-center justify-center py-12"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                        >
                          <motion.div
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-6"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 10, -10, 10, 0],
                              boxShadow: [
                                "0 0 20px rgba(251, 191, 36, 0.3)",
                                "0 0 40px rgba(251, 191, 36, 0.6)",
                                "0 0 20px rgba(251, 191, 36, 0.3)"
                              ]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <Gift size={64} className="text-white" />
                          </motion.div>
                          
                          <motion.h2
                            className="text-2xl font-bold mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            Daily Reward Unlocked!
                          </motion.h2>
                          
                          <motion.p
                            className="text-[var(--text-secondary)] mb-6 text-center max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            You've opened today's challenge.
                            Solve this problem to earn even more rewards!
                          </motion.p>
                          
                          <motion.button
                            className="btn-primary flex items-center"
                            onClick={handleCollectReward}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Star size={18} className="mr-2" />
                            Collect Reward
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="question"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center">
                                <Sparkles className="text-[var(--accent)] mr-2" size={20} />
                                <h2 className="text-2xl font-bold">{questionOfTheDay.title}</h2>
                              </div>
                              <div className="flex items-center mt-1">
                                <span className={`text-sm font-medium ${getDifficultyColor(questionOfTheDay.difficulty)}`}>
                                  {questionOfTheDay.difficulty}
                                </span>
                                <span className="text-[var(--text-secondary)] mx-2">•</span>
                                <span className="text-sm text-[var(--text-secondary)]">{
                                  new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                }</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-line">{questionOfTheDay.description}</div>
                            
                            {questionOfTheDay.examples.length > 0 && (
                              <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Examples</h3>
                                <div className="space-y-4">
                                  {questionOfTheDay.examples.map((example, idx) => (
                                    <motion.div 
                                      key={idx} 
                                      className="bg-[var(--primary)] p-4 rounded-lg"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.2 + idx * 0.1 }}
                                    >
                                      <div>
                                        <span className="font-medium">Input:</span> {example.input}
                                      </div>
                                      <div className="mt-1">
                                        <span className="font-medium">Output:</span> {example.output}
                                      </div>
                                      {example.explanation && (
                                        <div className="mt-1">
                                          <span className="font-medium">Explanation:</span> {example.explanation}
                                        </div>
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {questionOfTheDay.constraints.length > 0 && (
                              <motion.div 
                                className="mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                <h3 className="text-xl font-semibold mb-3">Constraints</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {questionOfTheDay.constraints.map((constraint, idx) => (
                                    <li key={idx}>{constraint}</li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                          
                          <motion.div 
                            className="mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Link
                              to={`/code/${questionOfTheDay.id}`}
                              className="btn-primary flex items-center justify-center w-full py-3 group"
                            >
                              Take on the Challenge
                              <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
                
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                  {/* Timer Card */}
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-4">
                      <Clock className="text-[var(--accent)] mr-2" size={20} />
                      <h3 className="text-lg font-semibold">Time Remaining</h3>
                    </div>
                    
                    <div className="bg-[var(--primary)] rounded-lg p-4 text-center">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <motion.div 
                          className="relative overflow-hidden"
                          key={timeRemaining.hours}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="text-3xl font-bold text-[var(--accent)]">
                            {timeRemaining.hours.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">Hours</div>
                        </motion.div>
                        <motion.div 
                          className="relative overflow-hidden"
                          key={timeRemaining.minutes}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                        >
                          <div className="text-3xl font-bold text-[var(--accent)]">
                            {timeRemaining.minutes.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">Minutes</div>
                        </motion.div>
                        <motion.div 
                          className="relative overflow-hidden"
                          key={timeRemaining.seconds}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                        >
                          <div className="text-3xl font-bold text-[var(--accent)]">
                            {timeRemaining.seconds.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">Seconds</div>
                        </motion.div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Until the next question of the day
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Top Solvers */}
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center mb-4">
                      <Award className="text-[var(--accent)] mr-2" size={20} />
                      <h3 className="text-lg font-semibold">Yesterday's Winners</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {previousWinners.map((winner, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center p-3 bg-[var(--primary)] rounded-lg"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ 
                            x: 5,
                            backgroundColor: "rgba(30, 30, 60, 0.8)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <motion.div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              index === 0 ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' : 
                              index === 1 ? 'bg-gray-400 bg-opacity-20 text-gray-400' : 
                              index === 2 ? 'bg-amber-700 bg-opacity-20 text-amber-700' : 'bg-gray-700'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            {index + 1}
                          </motion.div>
                          <div className="flex-grow">
                            <div className="font-medium">{winner.name}</div>
                            <div className="text-xs text-[var(--text-secondary)]">Solved in {winner.time}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Streak Card */}
                  <motion.div 
                    className="card text-center"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-semibold mb-3">Your QotD Streak</h3>
                    <motion.div 
                      className="text-5xl font-bold text-[var(--accent)] mb-2"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        textShadow: [
                          "0 0 0px rgba(244, 91, 105, 0)",
                          "0 0 10px rgba(244, 91, 105, 0.5)",
                          "0 0 0px rgba(244, 91, 105, 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      0
                    </motion.div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Solve today's question to start your streak!
                    </p>
                    
                    <motion.div 
                      className="mt-4 pt-4 border-t border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          Next Reward:
                        </span>
                        <span className="flex items-center text-yellow-400">
                          <Zap size={16} className="mr-1" />
                          +50 XP
                        </span>
                      </div>
                      
                      <div className="w-full bg-[var(--primary)] h-2 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          className="h-full bg-yellow-400"
                          initial={{ width: "0%" }}
                          animate={{ width: "10%" }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      
                      <p className="mt-2 text-xs text-[var(--text-secondary)]">
                        3 days streak: unlock special badge
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
      
      {/* Confetti animation */}
      <Confetti isVisible={showConfetti} />
      
      {/* Daily reward modal */}
      <AnimatePresence>
        {isBoxOpened && rewardCollected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gradient-to-br from-[var(--secondary)] to-[#1a1a3e] rounded-xl p-6 max-w-sm w-full text-center relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                animate={{ 
                  background: [
                    "radial-gradient(circle at 50% 50%, rgba(244, 91, 105, 0.1) 0%, rgba(26, 26, 46, 0) 70%)",
                    "radial-gradient(circle at 50% 50%, rgba(244, 91, 105, 0.2) 0%, rgba(26, 26, 46, 0) 70%)",
                    "radial-gradient(circle at 50% 50%, rgba(244, 91, 105, 0.1) 0%, rgba(26, 26, 46, 0) 70%)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <button 
                onClick={() => setRewardCollected(false)}
                className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white z-10"
              >
                <X size={20} />
              </button>
              
              <motion.div
                className="mb-4 relative z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  delay: 0.2
                }}
              >
                <CheckCircle size={64} className="mx-auto text-green-500" />
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold mb-2 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Reward Collected!
              </motion.h2>
              
              <motion.p
                className="text-[var(--text-secondary)] mb-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                You've opened today's challenge.
                <br />
                Solve the problem to earn even more rewards!
              </motion.p>
              
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  to={`/code/${questionOfTheDay.id}`}
                  className="btn-primary w-full flex items-center justify-center group"
                >
                  <ArrowRight size={18} className="mr-2 group-hover:translate-x-1 transition-transform" />
                  Start Coding Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default QuestionOfTheDayPage;