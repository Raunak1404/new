import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Users, Clock, Trophy, AlertCircle, UserMinus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../firebase/firebase';
import { joinMatchmaking, cancelMatchmaking, listenForMatch, getUserRecentMatches } from '../services/matchmaking';
import UserRankCard from '../components/UserRankCard';
import RecentMatchCard from '../components/RecentMatchCard';
import AnimatedAvatar from '../components/AnimatedAvatar';

const RankedMatchPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);
  const [searchingStatus, setSearchingStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  const [searchTime, setSearchTime] = useState(0);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const [avatarType, setAvatarType] = useState<'boy1' | 'boy2' | 'girl1' | 'girl2'>('boy1');
  const [opponent, setOpponent] = useState<string | null>(null);
  const [unsubscribeMatch, setUnsubscribeMatch] = useState<(() => void) | null>(null);
  
  // Start searching animation
  const [searchingPlayers, setSearchingPlayers] = useState(['Player 1', 'Player 2', 'Player 3']);
  const [searchingPlayersVisible, setSearchingPlayersVisible] = useState(false);
  
  // Clean up match listeners when unmounting
  useEffect(() => {
    return () => {
      if (unsubscribeMatch) {
        console.log("Cleaning up match listener on unmount");
        unsubscribeMatch();
      }
    };
  }, [unsubscribeMatch]);
  
  // Load user profile
  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.uid).then(({ data }) => {
        if (data) {
          setUserStats(data.stats);
          setAvatarType(data.selectedAvatar || 'boy1');
        }
      });
    }
  }, [currentUser]);
  
  // Load recent matches
  useEffect(() => {
    if (currentUser) {
      setLoadingMatches(true);
      getUserRecentMatches(currentUser.uid).then((matches) => {
        setRecentMatches(matches);
        setLoadingMatches(false);
      });
    }
  }, [currentUser]);

  // Set up timer for searching state
  useEffect(() => {
    let searchTimer: NodeJS.Timeout | null = null;
    
    if (searchingStatus === 'searching') {
      searchTimer = setInterval(() => {
        setSearchTime((prevTime) => prevTime + 1);
      }, 1000);
      
      // Rotate through players every 3 seconds for animation
      const playerTimer = setInterval(() => {
        setSearchingPlayersVisible(false);
        setTimeout(() => {
          setSearchingPlayers(prev => {
            const newPlayers = [...prev];
            const first = newPlayers.shift();
            if (first) newPlayers.push(first);
            return newPlayers;
          });
          setSearchingPlayersVisible(true);
        }, 500);
      }, 3000);
      
      return () => {
        if (searchTimer) clearInterval(searchTimer);
        clearInterval(playerTimer);
      };
    } else if (searchTimer) {
      clearInterval(searchTimer);
    }
    
    return () => {
      if (searchTimer) clearInterval(searchTimer);
    };
  }, [searchingStatus]);

  // Handle match found - extract into a separate function for clarity
  const handleMatchFound = (match: any) => {
    console.log('Match found!', match);
    setSearchingStatus('found');
    setMatchId(match.id);
    
    // Determine opponent ID
    const opponentId = match.player1 === currentUser?.uid ? match.player2 : match.player1;
    setOpponent(opponentId);
    
    // Navigate to code editor with match details
    setTimeout(() => {
      navigate(`/code/${match.problemId}`, { 
        state: { 
          matchId: match.id,
          isRankedMatch: true,
          opponent: opponentId
        } 
      });
    }, 1000); // Reduced from 2000ms to 1000ms for faster navigation
  };

  // Join matchmaking queue
  const handleJoinQueue = async () => {
    if (!currentUser) {
      setError('You must be logged in to join ranked matches');
      return;
    }
    
    try {
      setJoining(true);
      setError(null);
      
      // If we already have a match listener, clean it up first
      if (unsubscribeMatch) {
        unsubscribeMatch();
        setUnsubscribeMatch(null);
      }
      
      const result = await joinMatchmaking(currentUser.uid);
      
      if (result === 'waiting') {
        setSearchingStatus('searching');
        
        // Set up match listener
        const unsubscribe = listenForMatch(
          currentUser.uid,
          handleMatchFound, // Use extracted function
          (match) => {
            console.log('Match updated:', match);
            // Handle match updates if needed
          }
        );
        
        // Save unsubscribe function for cleanup
        setUnsubscribeMatch(() => unsubscribe);
      } else {
        // Match was immediately found - this is an existing match ID
        // Fetch match details and navigate
        const match = await fetch(`/api/matches/${result}`).then(res => res.json()).catch(() => null);
        
        if (match) {
          handleMatchFound(match);
        } else {
          // If we can't fetch match details, enter searching state and let the listener handle it
          setSearchingStatus('searching');
          
          // Set up match listener
          const unsubscribe = listenForMatch(
            currentUser.uid,
            handleMatchFound,
            (match) => {
              console.log('Match updated:', match);
            }
          );
          
          // Save unsubscribe function for cleanup
          setUnsubscribeMatch(() => unsubscribe);
        }
      }
    } catch (err: any) {
      console.error('Error joining matchmaking:', err);
      setError(err.message || 'Failed to join matchmaking');
      setSearchingStatus('idle');
    } finally {
      setJoining(false);
    }
  };

  const handleCancelSearch = async () => {
    if (!currentUser) return;
    
    try {
      await cancelMatchmaking(currentUser.uid);
      setSearchingStatus('idle');
      setSearchTime(0);
      
      // Clean up match listener when canceling search
      if (unsubscribeMatch) {
        unsubscribeMatch();
        setUnsubscribeMatch(null);
      }
    } catch (err: any) {
      console.error('Error canceling matchmaking:', err);
      setError(err.message || 'Failed to cancel matchmaking');
    }
  };

  // Format search time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentUser) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow py-12">
            <div className="container-custom">
              <div className="card text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Sign in to play ranked matches</h2>
                <p className="text-[var(--text-secondary)] mb-6">You need to be logged in to participate in ranked matches and earn rank points.</p>
                <a href="/login" className="btn-primary">Sign in</a>
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

        <main className="flex-grow py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-8">
                <Swords className="text-[var(--accent)] mr-3" size={28} />
                <h1 className="text-3xl font-bold">Ranked Matches</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-9 space-y-8">
                  {/* Queue Card */}
                  <motion.div 
                    className="card overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {searchingStatus === 'idle' ? (
                      <>
                        <h2 className="text-2xl font-bold mb-2">Challenge another coder</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                          Compete in a 1v1 coding challenge against another player. Solve problems faster and more accurately to win the match and increase your rank.
                        </p>
                        
                        <div className="bg-[var(--primary)] p-6 rounded-lg mb-6">
                          <div className="flex flex-col sm:flex-row items-center justify-between">
                            <div className="mb-4 sm:mb-0">
                              <h3 className="text-lg font-semibold flex items-center">
                                <Trophy className="text-[var(--accent)] mr-2" size={20} />
                                Ranked Match Rules
                              </h3>
                              <ul className="mt-3 text-sm text-[var(--text-secondary)] space-y-2 list-disc pl-5">
                                <li>Both players receive the same problem to solve</li>
                                <li>The winner is determined by test cases passed and submission time</li>
                                <li>Win to earn rank points and climb the leaderboard</li>
                                <li>You have 10 minutes to solve the problem</li>
                              </ul>
                            </div>
                            <div className="flex flex-col items-center">
                              <p className="text-sm text-[var(--text-secondary)] mb-2">
                                Win Reward
                              </p>
                              <div className="flex items-center gap-2 bg-[var(--secondary)] px-3 py-1 rounded-lg">
                                <Trophy className="text-yellow-400" size={16} />
                                <span className="text-yellow-400 font-medium">+1 Rank Point</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {error && (
                          <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6 flex items-center">
                            <AlertCircle size={20} className="mr-2" />
                            <span>{error}</span>
                          </div>
                        )}
                        
                        <motion.button
                          className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center"
                          onClick={handleJoinQueue}
                          disabled={joining}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {joining ? (
                            <>
                              <motion.div 
                                className="h-5 w-5 border-2 border-t-transparent rounded-full mr-3"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              ></motion.div>
                              Joining Queue...
                            </>
                          ) : (
                            <>
                              <Swords size={20} className="mr-2" />
                              Find Match Now
                            </>
                          )}
                        </motion.button>
                      </>
                    ) : searchingStatus === 'searching' ? (
                      <>
                        <div className="flex justify-between items-start">
                          <h2 className="text-2xl font-bold">Searching for opponent...</h2>
                          <motion.div 
                            className="text-xl font-bold text-[var(--accent)]"
                            animate={{ 
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {formatTime(searchTime)}
                          </motion.div>
                        </div>
                        
                        <motion.div 
                          className="relative h-40 my-8 bg-[var(--primary)] rounded-lg overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {/* Animated dots */}
                          <div className="absolute top-0 left-0 w-full h-full">
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute rounded-full bg-[var(--accent)]"
                                style={{
                                  width: Math.random() * 6 + 2,
                                  height: Math.random() * 6 + 2,
                                  opacity: Math.random() * 0.5 + 0.1,
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                  top: [
                                    `${Math.random() * 100}%`,
                                    `${Math.random() * 100}%`,
                                    `${Math.random() * 100}%`,
                                  ],
                                  left: [
                                    `${Math.random() * 100}%`,
                                    `${Math.random() * 100}%`,
                                    `${Math.random() * 100}%`,
                                  ],
                                }}
                                transition={{
                                  duration: 10 + Math.random() * 20,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Players being searched */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative flex items-center justify-center">
                              <AnimatedAvatar 
                                type={avatarType}
                                size={80}
                                interval={1000}
                              />
                              
                              <motion.div 
                                className="absolute w-36 h-36 rounded-full border-2 border-dashed border-[var(--accent)]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                              ></motion.div>
                              
                              <motion.div 
                                className="absolute w-48 h-48 rounded-full border-2 border-dashed border-[var(--accent-secondary)]"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                              ></motion.div>
                              
                              <AnimatePresence mode="wait">
                                {searchingPlayersVisible && (
                                  <motion.div 
                                    key="searching-players"
                                    className="absolute -top-20 bg-[var(--secondary)] px-4 py-2 rounded-full shadow-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <span className="text-sm">Checking {searchingPlayers[0]}...</span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                        
                        <div className="text-center mb-8">
                          <p className="text-[var(--text-secondary)] mb-4">
                            We're finding the best match for your skill level. This might take a moment...
                          </p>
                          
                          <motion.div 
                            className="h-2 bg-[var(--primary)] rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div 
                              className="h-full bg-[var(--accent)]"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 15, repeat: Infinity }}
                            />
                          </motion.div>
                        </div>
                        
                        <motion.button
                          className="btn-secondary w-full py-4 text-lg font-bold flex items-center justify-center"
                          onClick={handleCancelSearch}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <UserMinus size={20} className="mr-2" />
                          Cancel Search
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <div className="text-center py-8">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 260,
                              damping: 20
                            }}
                            className="mb-6"
                          >
                            <Swords size={60} className="mx-auto text-[var(--accent)]" />
                          </motion.div>
                          
                          <motion.h2 
                            className="text-3xl font-bold mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            Match Found!
                          </motion.h2>
                          
                          <motion.p 
                            className="text-[var(--text-secondary)] mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            Preparing your coding challenge...
                          </motion.p>
                          
                          <motion.div 
                            className="h-2 bg-[var(--primary)] rounded-full overflow-hidden max-w-md mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.div 
                              className="h-full bg-[var(--accent)]"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2 }}
                            />
                          </motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>
                  
                  {/* Recent Matches */}
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Recent Matches</h2>
                      <button className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]">View All</button>
                    </div>
                    
                    {loadingMatches ? (
                      <div className="flex justify-center py-8">
                        <motion.div 
                          className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        ></motion.div>
                      </div>
                    ) : recentMatches.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {recentMatches.map(match => (
                          <RecentMatchCard 
                            key={match.id} 
                            match={match} 
                            currentUserId={currentUser?.uid || ''}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[var(--primary)] p-6 rounded-lg text-center">
                        <p className="text-[var(--text-secondary)]">No recent matches</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">
                          Complete your first ranked match to see your history.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-3 space-y-6">
                  {/* User Rank Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <UserRankCard />
                  </motion.div>
                  
                  {/* Stats Card */}
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-[var(--primary)] p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Matches</span>
                          <span className="font-medium">{userStats?.rankMatches || 0}</span>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--primary)] p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Wins</span>
                          <span className="font-medium">{userStats?.rankWins || 0}</span>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--primary)] p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Win Rate</span>
                          <span className="font-medium">
                            {userStats?.rankMatches > 0 ? Math.round((userStats.rankWins / userStats.rankMatches) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--primary)] p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Rank Points</span>
                          <span className="font-medium text-[var(--accent)]">{userStats?.totalRankPoints || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Quick Tips */}
                  <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
                    
                    <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                      <p>
                        ⚡️ Speed matters! Ties are broken by submission time.
                      </p>
                      <p>
                        🎯 Make sure your solution passes all test cases.
                      </p>
                      <p>
                        💪 Consistent wins will help you climb ranks faster.
                      </p>
                      <p>
                        🏆 Reach Diamond rank to join exclusive tournaments.
                      </p>
                    </div>
                  </motion.div>
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

export default RankedMatchPage;