import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Clock, Award, Star, Calendar, ArrowUp, CheckSquare, TrendingUp, Target } from 'lucide-react';
import Trophy from '../components/icons/Trophy';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../firebase/firebase';
import { codingProblems } from '../data/codingProblems';

// Define achievements with criteria - same as in ProfilePage
const achievementsList = [
  { id: 1, name: "First Steps", description: "Solve your first coding problem", icon: "🎯", criteria: { problemsSolved: 1 } },
  { id: 2, name: "Getting Started", description: "Solve 5 coding problems", icon: "🔰", criteria: { problemsSolved: 5 } },
  { id: 3, name: "Problem Solver", description: "Solve 25 coding problems", icon: "💡", criteria: { problemsSolved: 25 } },
  { id: 4, name: "Code Warrior", description: "Solve 100 coding problems", icon: "⚔️", criteria: { problemsSolved: 100 } },
  { id: 5, name: "Coding Master", description: "Solve 250 coding problems", icon: "🏆", criteria: { problemsSolved: 250 } },
  { id: 6, name: "Streak Starter", description: "Maintain a 3-day coding streak", icon: "🔥", criteria: { currentStreak: 3 } },
  { id: 7, name: "Streak Warrior", description: "Maintain a 7-day coding streak", icon: "📆", criteria: { currentStreak: 7 } },
  { id: 8, name: "Streak Master", description: "Maintain a 30-day coding streak", icon: "📅", criteria: { currentStreak: 30 } },
  { id: 9, name: "Bronze Competitor", description: "Reach Bronze rank in Ranked Matches", icon: "🥉", criteria: { rank: "Bronze" } },
  { id: 10, name: "Silver Competitor", description: "Reach Silver rank in Ranked Matches", icon: "🥈", criteria: { rank: "Silver" } },
  { id: 11, name: "Gold Competitor", description: "Reach Gold rank in Ranked Matches", icon: "🥇", criteria: { rank: "Gold" } },
  { id: 12, name: "Platinum Competitor", description: "Reach Platinum rank in Ranked Matches", icon: "🔷", criteria: { rank: "Platinum" } },
  { id: 13, name: "Diamond Competitor", description: "Reach Diamond rank in Ranked Matches", icon: "💎", criteria: { rank: "Diamond" } },
  { id: 14, name: "First Victory", description: "Win your first ranked match", icon: "🏅", criteria: { rankWins: 1 } },
  { id: 15, name: "Victorious", description: "Win 10 ranked matches", icon: "🏅", criteria: { rankWins: 10 } },
  { id: 16, name: "Champion", description: "Win 50 ranked matches", icon: "🏅", criteria: { rankWins: 50 } }
];

const StatsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageSolveTime: 0,
    solvedProblems: [] as number[],
    totalRankPoints: 0,
    rank: '',
    rankWins: 0,
    rankMatches: 0
  });

  const [userAchievements, setUserAchievements] = useState<number[]>([]);
  const [selectedAchievements, setSelectedAchievements] = useState<number[]>([1, 2]);
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);
  const [newAchievement, setNewAchievement] = useState<any>(null);

  // Fetch user stats once on component mount
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getUserProfile(currentUser.uid);
        if (error) {
          throw new Error(error);
        }
        
        if (data) {
          setStats({
            problemsSolved: data.stats?.problemsSolved || 0,
            currentStreak: data.stats?.currentStreak || 0,
            bestStreak: data.stats?.bestStreak || 0,
            averageSolveTime: data.stats?.averageSolveTime || 0,
            solvedProblems: data.solvedProblems || [],
            totalRankPoints: data.stats?.totalRankPoints || 0,
            rank: data.stats?.rank || '',
            rankWins: data.stats?.rankWins || 0,
            rankMatches: data.stats?.rankMatches || 0
          });
          setUserAchievements(data.achievements || []);
          setSelectedAchievements(data.showcasedAchievements || [1, 2]);
          
          // Check for new achievements
          const newlyEarnedAchievements = checkForNewAchievements(data);
          if (newlyEarnedAchievements.length > 0) {
            // Save the newly earned achievements
            await saveNewAchievements(data, newlyEarnedAchievements);
            
            // Show banner for the first new achievement
            setNewAchievement(achievementsList.find(a => a.id === newlyEarnedAchievements[0]));
            setShowAchievementBanner(true);
            
            // Close the banner after 5 seconds
            setTimeout(() => {
              setShowAchievementBanner(false);
            }, 5000);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  // Check which achievements have been earned
  const checkForNewAchievements = (userData: any) => {
    if (!userData || !userData.stats) return [];
    
    const stats = userData.stats;
    const currentAchievements = userData.achievements || [];
    const newlyEarnedAchievements: number[] = [];
    
    achievementsList.forEach(achievement => {
      if (currentAchievements.includes(achievement.id)) return;
      
      let earned = true;
      
      for (const [key, value] of Object.entries(achievement.criteria)) {
        if (key === 'rank') {
          if (stats.rank !== value) {
            earned = false;
            break;
          }
        } else if (stats[key] < value) {
          earned = false;
          break;
        }
      }
      
      if (earned) {
        newlyEarnedAchievements.push(achievement.id);
      }
    });
    
    return newlyEarnedAchievements;
  };
  
  const saveNewAchievements = async (userData: any, newAchievements: number[]) => {
    if (!currentUser) return;
    
    try {
      const currentAchievements = userData.achievements || [];
      const updatedAchievements = [...currentAchievements, ...newAchievements];
      
      await updateUserProfile(currentUser.uid, {
        achievements: updatedAchievements
      });
      
      setUserAchievements(updatedAchievements);
      
      console.log("New achievements saved:", newAchievements);
    } catch (error) {
      console.error("Failed to save achievements:", error);
    }
  };

  const toggleAchievement = (id: number) => {
    if (!userAchievements.includes(id)) return;
    
    if (selectedAchievements.includes(id)) {
      if (selectedAchievements.length > 1) {
        setSelectedAchievements(selectedAchievements.filter(a => a !== id));
      }
    } else if (selectedAchievements.length < 3) {
      setSelectedAchievements([...selectedAchievements, id]);
    }
    
    if (currentUser) {
      updateUserProfile(currentUser.uid, {
        showcasedAchievements: selectedAchievements.includes(id) 
          ? selectedAchievements.filter(a => a !== id)
          : [...selectedAchievements, id].slice(0, 3)
      }).catch(error => {
        console.error("Failed to save showcased achievements:", error);
      });
    }
  };

  const getDifficultyStats = () => {
    const solvedProblemDetails = codingProblems.filter(p => stats.solvedProblems.includes(p.id));
    return {
      Easy: {
        solved: solvedProblemDetails.filter(p => p.difficulty === 'Easy').length,
        total: codingProblems.filter(p => p.difficulty === 'Easy').length
      },
      Medium: {
        solved: solvedProblemDetails.filter(p => p.difficulty === 'Medium').length,
        total: codingProblems.filter(p => p.difficulty === 'Medium').length
      },
      Hard: {
        solved: solvedProblemDetails.filter(p => p.difficulty === 'Hard').length,
        total: codingProblems.filter(p => p.difficulty === 'Hard').length
      }
    };
  };

  const getCategoryStats = () => {
    const categories = new Map();
    codingProblems.forEach(problem => {
      problem.tags.forEach(tag => {
        if (!categories.has(tag)) {
          categories.set(tag, { total: 0, solved: 0 });
        }
        categories.get(tag).total++;
        if (stats.solvedProblems.includes(problem.id)) {
          categories.get(tag).solved++;
        }
      });
    });

    return Array.from(categories.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 4);
  };

  if (!currentUser) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow py-16">
            <div className="container-custom">
              <div className="card p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                <p className="text-[var(--text-secondary)] mb-6">You need to be logged in to view your stats</p>
                <a href="/login" className="btn-primary inline-block">Log In</a>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const difficultyStats = getDifficultyStats();
  const categoryStats = getCategoryStats();

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
                <BarChart2 className="text-[var(--accent)] mr-3" size={28} />
                <h1 className="text-3xl font-bold">Your Statistics</h1>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { 
                        title: "Problems Solved", 
                        value: stats.problemsSolved.toString(), 
                        icon: <CheckSquare className="text-[var(--accent)]" size={20} />,
                        change: `${stats.problemsSolved > 0 ? '+' : ''}${stats.problemsSolved} total` 
                      },
                      { 
                        title: "Coding Streak", 
                        value: `${stats.currentStreak} days`, 
                        icon: <TrendingUp className="text-[var(--accent)]" size={20} />,
                        change: `Best: ${stats.bestStreak} days` 
                      },
                      { 
                        title: "Avg. Solve Time", 
                        value: stats.averageSolveTime > 0 ? `${Math.round(stats.averageSolveTime / 60)} min` : '-- min', 
                        icon: <Clock className="text-[var(--accent)]" size={20} />,
                        change: stats.averageSolveTime > 0 ? `${stats.averageSolveTime} seconds` : 'No data yet' 
                      },
                      { 
                        title: "Current Rank", 
                        value: stats.rank || (stats.totalRankPoints > 0 ? "Bronze" : "Unranked"), 
                        icon: <Target className="text-[var(--accent)]" size={20} />,
                        change: `${stats.totalRankPoints} Rank Points` 
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="card"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-[var(--text-secondary)]">{stat.title}</h2>
                          {stat.icon}
                        </div>
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{stat.change}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="card lg:col-span-1">
                      <div className="flex items-center mb-4">
                        <Trophy className="text-[var(--accent)] mr-2" size={20} />
                        <h2 className="text-xl font-bold">Your Rankings</h2>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { category: "Country", rank: "Unranked", total: "??" },
                          { category: "Local Area", rank: "Unranked", total: "??" },
                          { category: "Friends", rank: "Unranked", total: "??" }
                        ].map((ranking, index) => (
                          <div key={index} className="bg-[var(--primary)] p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-[var(--text-secondary)]">{ranking.category}</span>
                              <div className="text-right">
                                <p className="font-semibold">{ranking.rank}</p>
                                <p className="text-xs text-[var(--text-secondary)]">of {ranking.total}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-sm text-[var(--text-secondary)]">
                          Solve coding problems to improve your rank in the global leaderboards.
                        </p>
                      </div>
                    </div>
                    
                    <div className="card lg:col-span-2">
                      <div className="flex items-center mb-6">
                        <Star className="text-[var(--accent)] mr-2" size={20} />
                        <h2 className="text-xl font-bold">Problem Solving</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {Object.entries(difficultyStats).map(([difficulty, stats], index) => (
                          <div key={index} className="bg-[var(--primary)] p-4 rounded-lg">
                            <h3 className={`text-sm font-medium mb-2 ${
                              difficulty === 'Easy' ? 'text-green-400' :
                              difficulty === 'Medium' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {difficulty}
                            </h3>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold">{stats.solved}</span>
                              <span className="text-xs text-[var(--text-secondary)]">of {stats.total} solved</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                              <div className={`h-2 rounded-full ${
                                difficulty === 'Easy' ? 'bg-green-400' :
                                difficulty === 'Medium' ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`} style={{width: `${(stats.solved / stats.total) * 100}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-[var(--primary)] p-4 rounded-lg mb-4">
                        <h3 className="text-sm font-medium mb-3">Problem Categories</h3>
                        <div className="space-y-3">
                          {categoryStats.map(([category, stats], index) => (
                            <div key={index}>
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span>{category}</span>
                                <span className="text-[var(--text-secondary)]">{stats.solved}/{stats.total}</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-1.5">
                                <div 
                                  className="bg-[var(--accent)] h-1.5 rounded-full" 
                                  style={{width: `${(stats.solved / stats.total) * 100}%`}}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-[var(--primary)] p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
                        {stats.solvedProblems.length > 0 ? (
                          <div className="space-y-2">
                            {codingProblems
                              .filter(p => stats.solvedProblems.includes(p.id))
                              .slice(0, 5)
                              .map((problem, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm">{problem.title}</span>
                                  <span className={`text-xs ${
                                    problem.difficulty === 'Easy' ? 'text-green-400' :
                                    problem.difficulty === 'Medium' ? 'text-yellow-400' :
                                    'text-red-400'
                                  }`}>
                                    {problem.difficulty}
                                  </span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="flex justify-center items-center py-6">
                            <div className="text-center">
                              <Calendar className="mx-auto text-[var(--text-secondary)] mb-3" size={24} />
                              <p className="text-[var(--text-secondary)]">No recent activity</p>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                Start solving problems to see your activity
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center mb-6">
                      <Award className="text-[var(--accent)] mr-2" size={24} />
                      <h2 className="text-2xl font-bold">Achievements & Badges</h2>
                    </div>
                    
                    <div className="card">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Showcased Achievements</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                          Select up to 3 achievements to showcase on your profile. Click on an earned achievement to toggle showcase status.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {achievementsList
                            .filter(achievement => selectedAchievements.includes(achievement.id))
                            .map((achievement) => {
                              const isEarned = userAchievements.includes(achievement.id);
                              return (
                                <motion.div 
                                  key={achievement.id}
                                  className={`flex items-center p-4 rounded-xl cursor-pointer ${
                                    isEarned ? 'bg-[var(--accent)] bg-opacity-15 border border-[var(--accent)] shadow-lg' : 'bg-[var(--primary)] opacity-60'
                                  }`}
                                  whileHover={{ scale: isEarned ? 1.02 : 1 }}
                                  onClick={() => toggleAchievement(achievement.id)}
                                >
                                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-4 text-xl">
                                    <span>{achievement.icon}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-base">{achievement.name}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{achievement.description}</p>
                                    <div className="mt-1 text-xs text-[var(--accent)]">Showcased</div>
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {achievementsList.map((achievement) => {
                          let progress = 0;
                          let total = 0;
                          
                          for (const [key, value] of Object.entries(achievement.criteria)) {
                            if (key === 'rank') {
                              const rankOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
                              const currentRankIndex = rankOrder.indexOf(stats.rank || '');
                              const targetRankIndex = rankOrder.indexOf(value as string);
                              
                              if (currentRankIndex >= targetRankIndex && targetRankIndex >= 0) {
                                progress = 1;
                                total = 1;
                              } else {
                                progress = 0;
                                total = 1;
                              }
                            } else {
                              const stat = stats[key as keyof typeof stats] as number || 0;
                              progress = Math.min(stat, value as number);
                              total = value as number;
                            }
                          }
                          
                          const earned = userAchievements.includes(achievement.id);
                          const isSelected = selectedAchievements.includes(achievement.id);
                          
                          return (
                            <div 
                              key={achievement.id} 
                              className={`bg-[var(--primary)] p-4 rounded-lg border cursor-pointer ${
                                earned ? (isSelected ? 'border-[var(--accent)]' : 'border-transparent') : 'border-transparent opacity-60'
                              }`}
                              onClick={() => earned && toggleAchievement(achievement.id)}
                            >
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-3 text-xl">
                                  {achievement.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                                  <p className="text-xs text-[var(--text-secondary)] mb-2">{achievement.description}</p>
                                  
                                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                                    <div 
                                      className={`h-1.5 rounded-full ${earned ? 'bg-green-400' : 'bg-[var(--accent)]'}`} 
                                      style={{width: total > 0 ? `${(progress / total) * 100}%` : '0%'}}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {progress}/{total}
                                    </p>
                                    {earned && (
                                      <span className="text-xs text-green-400 flex items-center">
                                        Earned
                                        {isSelected && (
                                          <span className="ml-1 bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded text-[var(--accent)] text-xs">
                                            ★
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
      
      <AnimatePresence>
        {showAchievementBanner && newAchievement && (
          <motion.div 
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] p-6 rounded-xl shadow-xl flex items-center gap-5 relative overflow-hidden"
              animate={{ 
                boxShadow: [
                  "0 0 0px rgba(244, 91, 105, 0.3)",
                  "0 0 30px rgba(244, 91, 105, 0.6)",
                  "0 0 0px rgba(244, 91, 105, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: 3 }}
            >
              <motion.div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white"
                    initial={{
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                      opacity: 0
                    }}
                    animate={{
                      x: [null, Math.random() * 100 + '%'],
                      y: [null, Math.random() * 100 + '%'],
                      opacity: [0, 0.7, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.div
                className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center text-4xl shrink-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 1.5, repeat: 2 }}
              >
                {newAchievement.icon}
              </motion.div>
              
              <div className="text-left">
                <motion.h3 
                  className="text-xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: 3 }}
                >
                  Achievement Unlocked!
                </motion.h3>
                <p className="text-lg font-medium">{newAchievement.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{newAchievement.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default StatsPage;