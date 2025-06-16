import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Medal, Users, MapPin, User, Search, ArrowUp, Code, Swords, Trophy as TrophyIcon } from 'lucide-react';
import Trophy from '../components/icons/Trophy';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, getUserProfile, getUserRankPosition } from '../firebase/firebase';
import AnimatedAvatar from '../components/AnimatedAvatar';

// Animation variants
const floatingAnimation = {
  y: [0, -15, 0],
  transition: { 
    duration: 6, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 3, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

const glowAnimation = {
  textShadow: [
    "0 0 0px rgba(244, 91, 105, 0)",
    "0 0 10px rgba(244, 91, 105, 0.5)",
    "0 0 0px rgba(244, 91, 105, 0)"
  ],
  transition: { 
    duration: 3, 
    repeat: Infinity, 
    repeatType: "reverse" 
  }
};

const blobAnimation = {
  scale: [1, 1.2, 1],
  opacity: [0.3, 0.5, 0.3],
  transition: { 
    duration: 8, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }
};

const cardHoverAnimation = {
  y: -5,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.3 }
};

const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Leaderboard data
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const [rankedLeaderboard, setRankedLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [userRankPosition, setUserRankPosition] = useState<number | null>(null);
  
  // Fetch leaderboard data once when component mounts
  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        // Fetch global leaderboard
        const { data: globalData, error: globalError } = await getLeaderboard('global', 20);
        if (globalError) {
          throw new Error(globalError);
        }
        setGlobalLeaderboard(globalData);
        
        // Fetch ranked leaderboard
        const { data: rankedData, error: rankedError } = await getLeaderboard('rankPoints', 20);
        if (rankedError) {
          throw new Error(rankedError);
        }
        setRankedLeaderboard(rankedData);
        
        // Get current user rank
        if (currentUser) {
          const { data: userData } = await getUserProfile(currentUser.uid);
          if (userData) {
            setUserRank({
              id: currentUser.uid,
              name: userData.name || 'You',
              coderName: userData.coderName || '',
              selectedAvatar: userData.selectedAvatar || 'boy1',
              stats: userData.stats || {}
            });
            
            // Also get user's position in both leaderboards
            const globalPosition = await getUserRankPosition(currentUser.uid, 'global');
            const rankedPosition = await getUserRankPosition(currentUser.uid, 'rankPoints');
            
            if (!globalPosition.error && !rankedPosition.error) {
              setUserRankPosition(activeTab === 'global' ? globalPosition.rank : rankedPosition.rank);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboards();
  }, [currentUser, activeTab]);

  // Filter based on search term
  const filteredGlobalLeaderboard = globalLeaderboard.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.coderName && user.coderName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRankedLeaderboard = rankedLeaderboard.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.coderName && user.coderName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Determine which leaderboard to display
  const activeLeaderboard = activeTab === 'global' 
    ? filteredGlobalLeaderboard 
    : activeTab === 'ranked'
      ? filteredRankedLeaderboard
      : [];

  // Get score field based on active tab
  const getScoreField = (tab: string) => {
    switch(tab) {
      case 'global':
        return 'totalPoints';
      case 'ranked':
        return 'totalRankPoints';
      default:
        return 'score';
    }
  };

  // Get score label based on active tab
  const getScoreLabel = (tab: string) => {
    switch(tab) {
      case 'global':
        return 'Points';
      case 'ranked':
        return 'Rank Points';
      default:
        return 'Score';
    }
  };

  // Get icon based on active tab
  const getTabIcon = (tab: string, size: number = 20) => {
    switch(tab) {
      case 'global':
        return <Trophy size={size} />;
      case 'ranked':
        return <Swords size={size} />;
      case 'country':
        return <MapPin size={size} />;
      case 'local':
        return <MapPin size={size} />;
      case 'friends':
        return <Users size={size} />;
      default:
        return <Trophy size={size} />;
    }
  };

  // Function to get user rank icon/badge
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

  // Default avatar for users without selectedAvatar property
  const getDefaultAvatar = (index: number) => {
    const avatarTypes = ['boy1', 'boy2', 'girl1', 'girl2'];
    // Use consistent avatar based on user index
    return avatarTypes[index % avatarTypes.length];
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-12 relative overflow-hidden">
          {/* Background animated blobs */}
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[var(--accent)] filter blur-[200px] opacity-5"
              animate={blobAnimation}
            />
            <motion.div 
              className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-secondary)] filter blur-[180px] opacity-5"
              animate={{
                ...blobAnimation,
                transition: { 
                  ...blobAnimation.transition,
                  delay: 2 
                }
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-500 filter blur-[150px] opacity-3"
              animate={{
                ...blobAnimation,
                transition: { 
                  ...blobAnimation.transition,
                  delay: 4 
                }
              }}
            />
          </motion.div>

          <div className="container-custom relative z-10">
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
                  <Trophy className="text-[var(--accent)] mr-3" size={28} />
                </motion.div>
                <motion.h1 
                  className="text-3xl font-bold"
                  animate={glowAnimation}
                >
                  Leaderboard
                </motion.h1>
              </div>
              
              {/* Top 3 Users */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {activeLeaderboard.slice(0, 3).map((user, index) => {
                  const scoreField = getScoreField(activeTab);
                  const score = user.stats?.[scoreField] || 0;
                  const avatarType = user.selectedAvatar || getDefaultAvatar(index);
                    
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="card relative flex flex-col items-center p-8"
                      whileHover={{ y: -5 }}
                    >
                      <motion.div 
                        className={`absolute top-0 right-0 left-0 h-2 rounded-t-lg ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          'bg-amber-700'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      ></motion.div>
                      
                      <motion.div 
                        className="relative mb-2"
                        whileHover={{ y: -5 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 15,
                          delay: 0.4 + index * 0.1 
                        }}
                      >
                        <AnimatedAvatar 
                          type={avatarType}
                          size={100}
                          interval={8000 + index * 1000}
                        />
                        <motion.div 
                          className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            'bg-amber-700'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 15,
                            delay: 0.6 + index * 0.1
                          }}
                        >
                          <span className="text-white font-bold">{index + 1}</span>
                        </motion.div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-xl font-bold mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        animate={{ ...glowAnimation }}
                      >
                        {user.name}
                      </motion.h3>
                      {user.coderName && (
                        <motion.p 
                          className="text-sm text-[var(--text-secondary)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          {user.coderName}
                        </motion.p>
                      )}
                      <motion.p 
                        className="text-[var(--accent)] font-semibold mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        animate={pulseAnimation}
                      >
                        {score.toLocaleString()} {getScoreLabel(activeTab)}
                      </motion.p>
                      
                      {user.stats?.rank && activeTab === 'ranked' && (
                        <motion.div 
                          className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                            getUserRankBadge(user.stats.rank).color
                          }`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 15,
                            delay: 0.8 + index * 0.1
                          }}
                        >
                          {user.stats.rank} <motion.span
                            animate={{ 
                              rotate: [0, 10, 0, -10, 0],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {getUserRankBadge(user.stats.rank).icon}
                          </motion.span>
                        </motion.div>
                      )}
                      
                      <motion.div 
                        className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${
                          index === 0 ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' : 
                          index === 1 ? 'bg-gray-400 bg-opacity-20 text-gray-400' : 
                          'bg-amber-700 bg-opacity-20 text-amber-700'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        {index === 0 ? 'Gold 🏆' : index === 1 ? 'Silver 🥈' : 'Bronze 🥉'}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Leaderboard Tabs & Search */}
              <motion.div 
                className="card mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="flex space-x-4 mb-4 md:mb-0 overflow-x-auto py-2 md:py-0">
                    <motion.button
                      onClick={() => setActiveTab('global')}
                      className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
                        activeTab === 'global' 
                          ? 'bg-[var(--accent)] text-white' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--primary)]'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trophy size={16} className="mr-2" />
                      Overall Points
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveTab('ranked')}
                      className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
                        activeTab === 'ranked' 
                          ? 'bg-[var(--accent)] text-white' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--primary)]'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Swords size={16} className="mr-2" />
                      Ranked Matches
                    </motion.button>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                    <motion.input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[var(--primary)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      whileFocus={{ boxShadow: "0 0 0 3px rgba(244, 91, 105, 0.3)" }}
                    />
                  </div>
                </div>
                
                {/* Leaderboard Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <motion.div 
                        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <motion.tr 
                          className="border-b border-gray-700"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                            User
                          </th>
                          {activeTab === 'ranked' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                              Rank
                            </th>
                          )}
                          <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                            {getScoreLabel(activeTab)}
                          </th>
                        </motion.tr>
                      </thead>
                      <tbody>
                        {activeLeaderboard.length > 0 ? (
                          activeLeaderboard.map((user, index) => {
                            const isCurrentUser = currentUser && user.id === currentUser.uid;
                            const scoreField = getScoreField(activeTab);
                            const score = user.stats?.[scoreField] || 0;
                            const avatarType = user.selectedAvatar || getDefaultAvatar(index);
                            
                            return (
                              <motion.tr 
                                key={user.id} 
                                className={`border-b border-gray-800 hover:bg-[var(--primary)] hover:bg-opacity-30 transition-colors ${
                                  isCurrentUser ? 'bg-[var(--accent)] bg-opacity-10' : ''
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.7 + index * 0.03 }}
                                whileHover={{ backgroundColor: "rgba(30, 30, 46, 0.5)" }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <motion.div 
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                      index === 0 ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' : 
                                      index === 1 ? 'bg-gray-400 bg-opacity-20 text-gray-400' : 
                                      index === 2 ? 'bg-amber-700 bg-opacity-20 text-amber-700' : 
                                      'bg-[var(--primary)] text-[var(--text-secondary)]'
                                    }`}
                                    whileHover={{ scale: 1.2 }}
                                  >
                                    {index + 1}
                                  </motion.div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <motion.div 
                                      className="h-10 w-10 flex-shrink-0"
                                      whileHover={{ y: -3 }}
                                    >
                                      <AnimatedAvatar 
                                        type={avatarType}
                                        size={40}
                                        interval={12000 + index * 500}
                                      />
                                    </motion.div>
                                    <div className="ml-4">
                                      <motion.div 
                                        className="text-sm font-medium text-[var(--text)]"
                                        whileHover={{ color: "var(--accent)" }}
                                      >
                                        {user.name}
                                        {isCurrentUser && (
                                          <span className="ml-2 text-xs text-[var(--accent)]">(You)</span>
                                        )}
                                      </motion.div>
                                      {user.coderName && (
                                        <div className="text-xs text-[var(--text-secondary)]">{user.coderName}</div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                {activeTab === 'ranked' && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {user.stats?.rank ? (
                                      <motion.span 
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          getUserRankBadge(user.stats.rank).color
                                        }`}
                                        whileHover={{ scale: 1.1 }}
                                      >
                                        <motion.span 
                                          animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.2, 1],
                                          }}
                                          transition={{ duration: 3, repeat: Infinity }}
                                          className="mr-1"
                                        >
                                          {getUserRankBadge(user.stats.rank).icon}
                                        </motion.span> 
                                        {user.stats.rank}
                                      </motion.span>
                                    ) : (
                                      <span className="text-xs text-[var(--text-secondary)]">Unranked</span>
                                    )}
                                  </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                  <motion.span 
                                    className={`font-semibold ${
                                      index === 0 ? 'text-yellow-400' : 
                                      index === 1 ? 'text-gray-300' : 
                                      index === 2 ? 'text-amber-400' : 
                                      'text-[var(--accent)]'
                                    }`}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {score.toLocaleString()}
                                  </motion.span>
                                </td>
                              </motion.tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={activeTab === 'ranked' ? 4 : 3} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                              {error ? `Error loading leaderboard: ${error}` : 'No users found matching your search criteria.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
              
              {/* Your Position Card */}
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.h2 
                  className="text-xl font-bold mb-4"
                  animate={glowAnimation}
                >
                  Your Position
                </motion.h2>
                {!currentUser ? (
                  <motion.div 
                    className="bg-[var(--primary)] p-4 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <p className="text-[var(--text-secondary)]">Please log in to see your ranking.</p>
                  </motion.div>
                ) : userRank ? (
                  <motion.div 
                    className="bg-[var(--primary)] p-4 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div 
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <AnimatedAvatar 
                            type={userRank.selectedAvatar || 'boy1'}
                            size={48}
                            interval={10000}
                          />
                        </div>
                        <div>
                          <motion.p 
                            className="font-medium"
                            animate={{ ...glowAnimation }}
                          >
                            {userRank.name}
                          </motion.p>
                          {userRank.coderName && (
                            <p className="text-xs text-[var(--text-secondary)]">{userRank.coderName}</p>
                          )}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="flex flex-col justify-center"
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-center mb-1">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                          >
                            <Trophy size={16} className="text-[var(--accent)] mr-2" />
                          </motion.div>
                          <span className="text-sm">Overall Points:</span>
                          <motion.span 
                            className="ml-auto font-semibold"
                            animate={pulseAnimation}
                          >
                            {userRank.stats?.totalPoints || 0}
                          </motion.span>
                        </div>
                        <div className="flex items-center">
                          <motion.div
                            animate={{
                              rotate: [0, 15, 0, -15, 0],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Swords size={16} className="text-[var(--accent)] mr-2" />
                          </motion.div>
                          <span className="text-sm">Rank Points:</span>
                          <motion.span 
                            className="ml-auto font-semibold"
                            animate={pulseAnimation}
                          >
                            {userRank.stats?.totalRankPoints || 0}
                          </motion.span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="flex flex-col justify-center"
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-center mb-1">
                          <Code size={16} className="text-[var(--accent)] mr-2" />
                          <span className="text-sm">Problems Solved:</span>
                          <span className="ml-auto font-semibold">{userRank.stats?.problemsSolved || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Medal size={16} className="text-[var(--accent)] mr-2" />
                          <span className="text-sm">Current Rank:</span>
                          <span className="ml-auto">
                            {userRank.stats?.rank ? (
                              <motion.span 
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  getUserRankBadge(userRank.stats.rank).color
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                <motion.span
                                  animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.2, 1],
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="mr-1"
                                >
                                  {getUserRankBadge(userRank.stats.rank).icon}
                                </motion.span>
                                {userRank.stats.rank}
                              </motion.span>
                            ) : (
                              <span className="font-semibold">Unranked</span>
                            )}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Your position in leaderboard */}
                    {userRankPosition && (
                      <motion.div 
                        className="mt-4 pt-4 border-t border-gray-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <div className="flex items-center justify-center">
                          <motion.div 
                            className="bg-[var(--accent)] bg-opacity-20 px-4 py-2 rounded-lg inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                            animate={{
                              boxShadow: [
                                "0 0 0px rgba(244, 91, 105, 0)",
                                "0 0 10px rgba(244, 91, 105, 0.3)",
                                "0 0 0px rgba(244, 91, 105, 0)"
                              ]
                            }}
                            transition={{ 
                              boxShadow: {
                                duration: 2, 
                                repeat: Infinity
                              }
                            }}
                          >
                            <ArrowUp className="text-[var(--accent)] mr-2" size={16} />
                            <span>Your position: <strong>{userRankPosition}</strong> of {activeLeaderboard.length}+ users</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="bg-[var(--primary)] p-4 rounded-lg flex items-center justify-center">
                    <motion.div 
                      className="h-6 w-6 border-t-2 border-b-2 border-[var(--accent)] rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <p>Loading your stats...</p>
                  </div>
                )}
                <motion.p 
                  className="text-sm text-[var(--text-secondary)] mt-4"
                  animate={floatingAnimation}
                >
                  Solve coding problems and win ranked matches to earn points and climb the leaderboard rankings.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LeaderboardPage;