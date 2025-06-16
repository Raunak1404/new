import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Award, Edit, Check, X, Code, Calendar, Swords, AlertCircle, Trophy, Medal, BarChart2, Clock, Siren as Fire, Heart, Sparkles, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../firebase/firebase';
import AnimatedAvatar from '../components/AnimatedAvatar';

// Avatar options
const avatarOptions = [
  {
    id: 'boy1',
    name: 'Coder Boy 1'
  },
  {
    id: 'boy2',
    name: 'Coder Boy 2'
  },
  {
    id: 'girl1',
    name: 'Coder Girl 1'
  },
  {
    id: 'girl2',
    name: 'Coder Girl 2'
  }
];

// Define achievements with criteria
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

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCoderName, setIsEditingCoderName] = useState(false);
  const [name, setName] = useState('New User');
  const [coderName, setCoderName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('boy1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [selectedAchievements, setSelectedAchievements] = useState<number[]>([1, 2]);
  const [dayStreak, setDayStreak] = useState(0);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const [userAchievements, setUserAchievements] = useState<number[]>([]);
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  
  // Load user profile data once on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          setError(null);
          const { data, error } = await getUserProfile(currentUser.uid);
          
          if (error) {
            setError(error);
          } else if (data) {
            setName(data.name || 'New User');
            setCoderName(data.coderName || '');
            setSelectedAvatar(data.selectedAvatar || 'boy1');
            setStats(data.stats || {});
            setDayStreak(data.stats?.currentStreak || 0);
            setBestStreak(data.stats?.bestStreak || 0);
            setUserAchievements(data.achievements || []);
            setSelectedAchievements(data.showcasedAchievements || [1, 2]);
            console.log("Profile data loaded:", data);
            
            // Check if we need to update the streak
            updateDayStreak(data);
            
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
          setError(err.message || 'Failed to load profile data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);
  
  // Check which achievements have been earned
  const checkForNewAchievements = (userData: any) => {
    if (!userData || !userData.stats) return [];
    
    const stats = userData.stats;
    const currentAchievements = userData.achievements || [];
    const newlyEarnedAchievements: number[] = [];
    
    // Check each achievement to see if criteria are met
    achievementsList.forEach(achievement => {
      // Skip if already earned
      if (currentAchievements.includes(achievement.id)) return;
      
      // Check criteria
      let earned = true;
      
      // Check all criteria
      for (const [key, value] of Object.entries(achievement.criteria)) {
        if (key === 'rank') {
          // Special handling for rank checks
          if (stats.rank !== value) {
            earned = false;
            break;
          }
        } else if (stats[key] < value) {
          earned = false;
          break;
        }
      }
      
      // If all criteria met, add to newly earned achievements
      if (earned) {
        newlyEarnedAchievements.push(achievement.id);
      }
    });
    
    return newlyEarnedAchievements;
  };
  
  // Save newly earned achievements to the user's profile
  const saveNewAchievements = async (userData: any, newAchievements: number[]) => {
    if (!currentUser) return;
    
    try {
      const currentAchievements = userData.achievements || [];
      const updatedAchievements = [...currentAchievements, ...newAchievements];
      
      // Update the profile with the new achievements
      await updateUserProfile(currentUser.uid, {
        achievements: updatedAchievements
      });
      
      // Update local state
      setUserAchievements(updatedAchievements);
      
      console.log("New achievements saved:", newAchievements);
    } catch (error) {
      console.error("Failed to save achievements:", error);
    }
  };

  // Update day streak based on last login
  const updateDayStreak = async (userData: any) => {
    if (!currentUser || !userData) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastLoginDate = userData.lastLoginDate ? new Date(userData.lastLoginDate) : null;
    let currentStreak = userData.stats?.currentStreak || 0;
    let bestStreak = userData.stats?.bestStreak || 0;
    
    // If we have a last login date
    if (lastLoginDate) {
      lastLoginDate.setHours(0, 0, 0, 0);
      
      // Calculate the difference in days
      const diffTime = today.getTime() - lastLoginDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // If they logged in yesterday, increment the streak
        currentStreak += 1;
      } else if (diffDays > 1) {
        // If they skipped days, reset the streak
        currentStreak = 1; // Today counts as day 1
      } else if (diffDays === 0) {
        // Already logged in today, don't change the streak
        return;
      }
    } else {
      // First time logging in
      currentStreak = 1;
    }
    
    // Update best streak if needed
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
    
    // Update state values
    setDayStreak(currentStreak);
    setBestStreak(bestStreak);
    
    // Update the user profile
    try {
      await updateUserProfile(currentUser.uid, {
        lastLoginDate: today.toISOString(),
        stats: {
          ...userData.stats,
          currentStreak,
          bestStreak
        }
      });
      
      console.log(`Streak updated: ${currentStreak}`);
      
      // Check if new streak achievements were earned
      const streakAchievements = achievementsList.filter(a => 
        a.criteria.currentStreak && 
        a.criteria.currentStreak <= currentStreak &&
        !userAchievements.includes(a.id)
      );
      
      if (streakAchievements.length > 0) {
        const newlyEarnedIds = streakAchievements.map(a => a.id);
        await saveNewAchievements(userData, newlyEarnedIds);
        
        // Show banner for the highest streak achievement earned
        const highestStreakAchievement = streakAchievements.reduce((highest, current) => 
          (current.criteria.currentStreak > highest.criteria.currentStreak) ? current : highest
        );
        
        setNewAchievement(highestStreakAchievement);
        setShowAchievementBanner(true);
        
        // Close the banner after 5 seconds
        setTimeout(() => {
          setShowAchievementBanner(false);
        }, 5000);
      }
    } catch (err) {
      console.error("Failed to update streak:", err);
    }
  };

  const toggleAchievement = (id: number) => {
    // Only allow toggling earned achievements
    if (!userAchievements.includes(id)) return;
    
    if (selectedAchievements.includes(id)) {
      if (selectedAchievements.length > 1) { // Keep at least one
        setSelectedAchievements(selectedAchievements.filter(a => a !== id));
      }
    } else if (selectedAchievements.length < 3) { // Maximum 3
      setSelectedAchievements([...selectedAchievements, id]);
    }
    
    // Save showcased achievements to profile
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

  const handleNameSave = async () => {
    if (!currentUser) return;

    try {
      setError(null);
      const result = await updateUserProfile(currentUser.uid, { name });
      
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditingName(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update name');
      console.error(err);
    }
  };

  const handleCoderNameSave = async () => {
    if (!currentUser) return;

    try {
      setError(null);
      const result = await updateUserProfile(currentUser.uid, { coderName });
      
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditingCoderName(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update coder name');
      console.error(err);
    }
  };

  const handleAvatarClick = () => {
    setShowAvatarSelector(true);
  };

  const selectAvatar = async (avatarId: string) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      const result = await updateUserProfile(currentUser.uid, { selectedAvatar: avatarId });
      
      if (result.error) {
        setError(result.error);
      } else {
        setSelectedAvatar(avatarId);
        setShowAvatarSelector(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update avatar');
      console.error(err);
    }
  };

  // Function to get user rank badge
  const getUserRankBadge = (rankName: string) => {
    switch (rankName) {
      case 'Diamond':
        return { icon: '💎', color: 'text-blue-400 bg-blue-400 bg-opacity-20' };
      case 'Platinum':
        return { icon: '🔷', color: 'text-cyan-300 bg-cyan-300 bg-opacity-20' };
      case 'Gold':
        return { icon: '🥇', color: 'text-yellow-400 bg-yellow-400 bg-opacity-20' };
      case 'Silver':
        return { icon: '🥈', color: 'text-gray-300 bg-gray-300 bg-opacity-20' };
      case 'Bronze':
        return { icon: '🥉', color: 'text-amber-700 bg-amber-700 bg-opacity-20' };
      default:
        return { icon: '🎯', color: 'text-blue-400 bg-blue-400 bg-opacity-20' };
    }
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
                <p className="text-[var(--text-secondary)] mb-6">You need to be logged in to view your profile</p>
                <a href="/login" className="btn-primary inline-block">Log In</a>
              </div>
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

        <main className="flex-grow py-16">
          <div className="container-custom">
            {error && (
              <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-8 flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
                <button 
                  className="ml-auto text-red-400 hover:text-red-300"
                  onClick={() => setError(null)}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            
            {saveSuccess && (
              <div className="bg-green-500 bg-opacity-20 text-green-400 p-4 rounded-lg mb-8 flex items-center">
                <Check size={20} className="mr-2" />
                <span>Profile updated successfully!</span>
                <button 
                  className="ml-auto text-green-400 hover:text-green-300"
                  onClick={() => setSaveSuccess(false)}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Profile Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="card md:col-span-1 h-fit"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-8">
                      {/* Animated Avatar */}
                      <div onClick={handleAvatarClick} className="cursor-pointer">
                        <AnimatedAvatar 
                          type={selectedAvatar as any} 
                          size={160} 
                          interval={8000}
                        />
                      </div>
                      <motion.button 
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10 bg-[var(--accent)] px-3 py-1 rounded-full text-xs text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAvatarClick}
                      >
                        Change Avatar
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center mb-4 w-full justify-center">
                      {isEditingName ? (
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-[var(--primary)] border border-[var(--accent)] rounded py-2 px-3 text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          />
                          <motion.button 
                            onClick={handleNameSave}
                            className="text-green-400 hover:text-green-300 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Check size={20} />
                          </motion.button>
                          <motion.button 
                            onClick={() => {
                              setIsEditingName(false);
                              const fetchUserProfile = async () => {
                                try {
                                  const { data } = await getUserProfile(currentUser.uid);
                                  if (data) {
                                    setName(data.name || 'New User');
                                  }
                                } catch (error) {
                                  console.error("Failed to reset name:", error);
                                }
                              };
                              fetchUserProfile();
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={20} />
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl font-semibold">{name}</h2>
                          <motion.button 
                            onClick={() => setIsEditingName(true)}
                            className="ml-3 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit size={18} />
                          </motion.button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-8 w-full justify-center">
                      {isEditingCoderName ? (
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={coderName}
                            onChange={(e) => setCoderName(e.target.value)}
                            placeholder="Enter coder name"
                            className="bg-[var(--primary)] border border-[var(--accent)] rounded py-2 px-3 text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          />
                          <motion.button 
                            onClick={handleCoderNameSave}
                            className="text-green-400 hover:text-green-300 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Check size={20} />
                          </motion.button>
                          <motion.button 
                            onClick={() => {
                              setIsEditingCoderName(false);
                              const fetchUserProfile = async () => {
                                try {
                                  const { data } = await getUserProfile(currentUser.uid);
                                  if (data) {
                                    setCoderName(data.coderName || '');
                                  }
                                } catch (error) {
                                  console.error("Failed to reset coder name:", error);
                                }
                              };
                              fetchUserProfile();
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={20} />
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <p className="text-[var(--text-secondary)] text-lg">
                            {coderName ? `@${coderName}` : 'No coder name set'}
                          </p>
                          <motion.button 
                            onClick={() => setIsEditingCoderName(true)}
                            className="ml-3 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit size={18} />
                          </motion.button>
                        </>
                      )}
                    </div>
                    
                    {stats.rank && (
                      <div className={`px-4 py-2 rounded-full mb-6 ${
                        getUserRankBadge(stats.rank).color
                      }`}>
                        {stats.rank} {getUserRankBadge(stats.rank).icon}
                      </div>
                    )}
                    
                    <div className="bg-[var(--primary)] px-4 py-2 rounded-full text-sm mb-8">
                      UID: {currentUser?.uid.substring(0, 10) || 'test123456'}...
                    </div>
                    
                    <div className="w-full">
                      <h3 className="font-semibold flex items-center gap-2 mb-6 text-lg">
                        <Award size={20} className="text-[var(--accent)]" />
                        Showcased Achievements
                      </h3>
                      
                      <div className="space-y-6">
                        {achievementsList
                          .filter(achievement => selectedAchievements.includes(achievement.id))
                          .map((achievement) => {
                            const isEarned = userAchievements.includes(achievement.id);
                            return (
                              <motion.div 
                                key={achievement.id}
                                className={`flex items-center p-4 rounded-xl transition-all ${
                                  isEarned ? 'bg-[var(--accent)] bg-opacity-15 border border-[var(--accent)] shadow-lg' : 'bg-[var(--primary)] opacity-50'
                                }`}
                                whileHover={{ scale: isEarned ? 1.02 : 1 }}
                              >
                                <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center mr-4 text-xl">
                                  <span>{achievement.icon}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-base">{achievement.name}</p>
                                  <p className="text-sm text-[var(--text-secondary)]">{achievement.description}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                      
                      <p className="text-sm text-[var(--text-secondary)] mt-6">
                        Go to your stats page to manage your showcased achievements
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Main Profile Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="md:col-span-2 space-y-10"
                >
                  {/* Welcome Card */}
                  <motion.div 
                    className="card bg-gradient-to-r from-[var(--secondary)] to-[#2a3a80]"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-3xl font-bold mb-6">Welcome back, {name.split(' ')[0]}!</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <motion.div 
                        className="bg-[var(--primary)] rounded-xl p-6 text-center relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--accent)] opacity-10 rounded-full"></div>
                        <Code className="mx-auto mb-4 text-[var(--accent)]" size={28} />
                        <p className="text-4xl font-bold text-[var(--accent)]">{stats.problemsSolved || 0}</p>
                        <p className="text-base text-[var(--text-secondary)]">Problems Solved</p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-[var(--primary)] rounded-xl p-6 text-center relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500 opacity-10 rounded-full"></div>
                        <Fire className="mx-auto mb-4 text-orange-500" size={28} />
                        <p className="text-4xl font-bold text-orange-500">{dayStreak}</p>
                        <p className="text-base text-[var(--text-secondary)]">Day Streak</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Best: {bestStreak}</p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-[var(--primary)] rounded-xl p-6 text-center relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500 opacity-10 rounded-full"></div>
                        {stats.rank ? (
                          <>
                            <Trophy className="mx-auto mb-4 text-indigo-400" size={28} />
                            <div className="text-3xl font-bold text-indigo-400 flex items-center justify-center">
                              {stats.rank}
                              <span className="ml-2">{getUserRankBadge(stats.rank).icon}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Trophy className="mx-auto mb-4 text-indigo-400" size={28} />
                            <p className="text-3xl font-bold text-indigo-400">Unranked</p>
                          </>
                        )}
                        <p className="text-base text-[var(--text-secondary)]">Current Rank</p>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Day Streak Card */}
                  <motion.div 
                    className="card"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-6">
                      <Calendar className="text-[var(--accent)] mr-3" size={24} />
                      <h2 className="text-2xl font-bold">Your Coding Streak</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg text-[var(--text-secondary)]">Current Streak:</span>
                          <span className="text-3xl font-bold text-orange-500 flex items-center">
                            {dayStreak} <Fire className="ml-2" size={24} />
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-lg text-[var(--text-secondary)]">Best Streak:</span>
                          <span className="text-3xl font-bold text-[var(--accent)]">{bestStreak}</span>
                        </div>
                        
                        <div className="bg-[var(--primary)] p-5 rounded-lg mt-2">
                          <p className="text-sm text-[var(--text-secondary)]">
                            <span className="text-orange-500 font-medium">Keep it up!</span> Log in every day to maintain your streak. 
                            If you miss a day, your streak will reset to zero.
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">Next Milestone: 7 days</span>
                            <span className="text-[var(--text-secondary)]">{dayStreak}/7</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 rounded-full mt-1">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${Math.min(100, (dayStreak / 7) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <div className="grid grid-cols-7 gap-2 mb-3">
                          {[...Array(7)].map((_, index) => {
                            const isActive = index < dayStreak % 7;
                            return (
                              <div 
                                key={index} 
                                className={`h-12 rounded-md ${
                                  isActive 
                                    ? 'bg-gradient-to-br from-orange-500 to-yellow-500' 
                                    : 'bg-[var(--primary)] border border-gray-700'
                                } flex items-center justify-center`}
                              >
                                {isActive && <Fire size={20} className="text-white" />}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                          <span>Today</span>
                          <span>Week milestone</span>
                        </div>
                        
                        <div className="bg-[var(--primary)] p-4 rounded-lg mt-4">
                          <h3 className="font-medium flex items-center mb-2">
                            <Sparkles className="text-yellow-400 mr-2" size={16} />
                            Streak Rewards
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>3 days:</span>
                              <span className="text-yellow-400">+25 XP, Streak Starter Badge</span>
                            </div>
                            <div className="flex justify-between">
                              <span>7 days:</span>
                              <span className="text-yellow-400">+100 XP, Streak Warrior Badge</span>
                            </div>
                            <div className="flex justify-between">
                              <span>30 days:</span>
                              <span className="text-yellow-400">+500 XP, Streak Master Badge</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Stats Overview */}
                  <div className="card">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <BarChart2 className="text-[var(--accent)] mr-2" size={24} />
                      Stats Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div className="bg-[var(--primary)] p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Trophy className="text-[var(--accent)] mr-2" size={18} />
                          Overall Stats
                        </h3>
                        <div className="space-y-5">
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Problems Solved:</span>
                            <span className="font-medium text-lg">{stats.problemsSolved || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Current Streak:</span>
                            <span className="font-medium text-lg flex items-center">
                              {dayStreak} <Fire className="ml-1 text-orange-500" size={16} />
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Best Streak:</span>
                            <span className="font-medium text-lg">{bestStreak} days</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Total Points:</span>
                            <span className="font-medium text-lg">{stats.totalPoints || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--primary)] p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Swords className="text-[var(--accent)] mr-2" size={18} />
                          Ranked Match Stats
                        </h3>
                        <div className="space-y-5">
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Rank Points:</span>
                            <span className="font-medium text-lg">{stats.totalRankPoints || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Matches Won:</span>
                            <span className="font-medium text-lg">{stats.rankWins || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Total Matches:</span>
                            <span className="font-medium text-lg">{stats.rankMatches || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--text-secondary)]">Win Rate:</span>
                            <span className="font-medium text-lg">
                              {stats.rankMatches > 0 
                                ? `${Math.round((stats.rankWins / stats.rankMatches) * 100)}%` 
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Link to="/stats" className="btn-secondary inline-flex items-center">
                        <BarChart2 size={18} className="mr-2" />
                        View Detailed Stats
                      </Link>
                    </div>
                  </div>
                  
                  {/* Achievements Overview */}
                  <div className="card">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Award className="text-[var(--accent)] mr-2" size={24} />
                      Your Achievements
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {achievementsList
                        .slice(0, 6) // Show only the first 6 achievements
                        .map((achievement) => {
                          const isEarned = userAchievements.includes(achievement.id);
                          const isSelected = selectedAchievements.includes(achievement.id);
                          
                          return (
                            <motion.div
                              key={achievement.id}
                              className={`p-4 rounded-lg cursor-pointer ${
                                isEarned 
                                  ? isSelected 
                                    ? 'bg-[var(--accent)] bg-opacity-15 border border-[var(--accent)]' 
                                    : 'bg-[var(--primary)]' 
                                  : 'bg-[var(--primary)] opacity-50'
                              }`}
                              whileHover={{ scale: isEarned ? 1.03 : 1 }}
                              onClick={() => isEarned && toggleAchievement(achievement.id)}
                            >
                              <div className="flex">
                                <div className="mr-3">
                                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-xl">
                                    {achievement.icon}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                                  <p className="text-xs text-[var(--text-secondary)]">{achievement.description}</p>
                                  
                                  {isEarned ? (
                                    <div className="mt-2 text-xs text-green-400 flex items-center">
                                      <Check size={12} className="mr-1" />
                                      Earned
                                      {isSelected && (
                                        <span className="ml-2 bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded text-[var(--accent)]">Showcased</span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="mt-2 text-xs text-[var(--text-secondary)]">
                                      Not yet earned
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                    
                    <div className="flex justify-center">
                      <Link to="/stats" className="btn-secondary inline-flex items-center">
                        <Award size={18} className="mr-2" />
                        View All Achievements
                      </Link>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="card">
                    <h2 className="text-2xl font-bold mb-8">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <motion.button
                        onClick={() => window.location.href = '/code'}
                        className="bg-[var(--primary)] hover:bg-opacity-90 rounded-xl p-6 text-left transition-all flex flex-col h-full"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Code className="text-[var(--accent)] mb-4" size={32} />
                        <h3 className="font-semibold text-xl mb-3">Practice Coding</h3>
                        <p className="text-base text-[var(--text-secondary)]">Start solving challenges from our library</p>
                      </motion.button>
                      <motion.button
                        onClick={() => window.location.href = '/question-of-the-day'}
                        className="bg-[var(--primary)] hover:bg-opacity-90 rounded-xl p-6 text-left transition-all flex flex-col h-full"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Calendar className="text-[var(--accent)] mb-4" size={32} />
                        <h3 className="font-semibold text-xl mb-3">Question of the Day</h3>
                        <p className="text-base text-[var(--text-secondary)]">Solve today's featured challenge</p>
                      </motion.button>
                      <motion.button
                        onClick={() => window.location.href = '/ranked-match'}
                        className="bg-[var(--primary)] hover:bg-opacity-90 rounded-xl p-6 text-left transition-all flex flex-col h-full"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Swords className="text-[var(--accent)] mb-4" size={32} />
                        <h3 className="font-semibold text-xl mb-3">Ranked Match</h3>
                        <p className="text-base text-[var(--text-secondary)]">Compete in 1v1 coding battles</p>
                      </motion.button>
                      <motion.button
                        onClick={() => window.location.href = '/study'}
                        className="bg-[var(--primary)] hover:bg-opacity-90 rounded-xl p-6 text-left transition-all flex flex-col h-full"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <BookOpen className="text-[var(--accent)] mb-4" size={32} />
                        <h3 className="font-semibold text-xl mb-3">Study Materials</h3>
                        <p className="text-base text-[var(--text-secondary)]">Learn algorithms and data structures</p>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
      
      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[var(--secondary)] rounded-xl p-6 max-w-xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Choose Your Avatar</h3>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="text-[var(--text-secondary)] hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                {avatarOptions.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className="flex flex-col items-center"
                  >
                    <AnimatedAvatar 
                      type={avatar.id as any}
                      selected={selectedAvatar === avatar.id}
                      onClick={() => selectAvatar(avatar.id)}
                      interval={Math.random() * 5000 + 5000} // Random interval between 5-10s
                    />
                    <p className="mt-2 font-medium">{avatar.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="btn-secondary mr-3"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="btn-primary"
                >
                  Select
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Achievement Unlocked Banner */}
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
              {/* Animated particles */}
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

export default ProfilePage;