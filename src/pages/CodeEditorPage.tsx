import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Copy, Download, RotateCcw, ArrowLeft, Loader, Check, X, AlertCircle, Swords, Trophy as TrophyIcon, Clock, ArrowRight } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { getProblemById, getInitialCodeSnippet } from '../data/codingProblems';
import { evaluateCode } from '../utils/judge0';
import { SubmissionResult as SubmissionResultType, TestCase, statusCodes } from '../types/judge0';
import SubmissionResult from '../components/SubmissionResult';
import { useAuth } from '../context/AuthContext';
import { updateProblemSolved, updateMatchResults, getUserProfile } from '../firebase/firebase';
import { submitMatchSolution, getMatch } from '../services/matchmaking';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' }
];

const CodeEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId, isRankedMatch, opponent } = location.state || {};
  const problemId = id ? parseInt(id, 10) : 0;
  const [problem, setProblem] = useState<any>(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser } = useAuth();
  const [startTime] = useState(Date.now());
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<SubmissionResultType[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Add match-specific state
  const [matchTimeRemaining, setMatchTimeRemaining] = useState(600); // 10 minutes in seconds
  const [matchStatus, setMatchStatus] = useState<'waiting' | 'in_progress' | 'completed'>('waiting');
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [opponentName, setOpponentName] = useState<string>(opponent || 'Opponent');
  const [opponentUpdates, setOpponentUpdates] = useState<string | null>(null);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);
  const [matchLoser, setMatchLoser] = useState<string | null>(null);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [resultsUpdated, setResultsUpdated] = useState(false);
  const [winnerProfile, setWinnerProfile] = useState<any>(null);
  const [loserProfile, setLoserProfile] = useState<any>(null);
  const [checkingInterval, setCheckingInterval] = useState<NodeJS.Timeout | null>(null);

  // Find problem by id
  useEffect(() => {
    if (id) {
      const foundProblem = getProblemById(problemId);
      if (foundProblem) {
        setProblem(foundProblem);
        // Set initial code snippet based on problem and language
        setCode(getInitialCodeSnippet(language, problemId));
      }
    }
  }, [id, problemId]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (checkingInterval) {
        clearInterval(checkingInterval);
      }
    };
  }, [checkingInterval]);

  // Load opponent profile
  useEffect(() => {
    const loadOpponentProfile = async () => {
      if (opponent && currentUser) {
        try {
          const { data } = await getUserProfile(opponent);
          if (data) {
            setOpponentName(data.name || data.coderName || opponent.substring(0, 8));
          }
        } catch (error) {
          console.error("Failed to load opponent profile:", error);
        }
      }
    };

    loadOpponentProfile();
  }, [opponent, currentUser]);

  // Load match details if this is a ranked match
  useEffect(() => {
    const loadMatchDetails = async () => {
      if (isRankedMatch && matchId) {
        try {
          const match = await getMatch(matchId);
          if (match) {
            setMatchDetails(match);
            setMatchStatus('in_progress');
            
            // If match already has submissions, check if we need to show results
            if (match.submissions && match.submissions[currentUser?.uid || '']) {
              // User has already submitted, show their results
              setShowResults(true);
              setMatchStatus('completed');
            }
            
            // Check if match is completed and has a winner
            if (match.status === 'completed' && match.winner) {
              const winnerId = match.winner;
              const loserId = winnerId === match.player1 ? match.player2 : match.player1;
              
              setMatchWinner(winnerId);
              setMatchLoser(loserId);
              setShowMatchResults(true);
              
              // Load profiles for winner and loser
              try {
                const { data: winnerData } = await getUserProfile(winnerId);
                const { data: loserData } = await getUserProfile(loserId);
                
                if (winnerData) setWinnerProfile(winnerData);
                if (loserData) setLoserProfile(loserData);
              } catch (error) {
                console.error("Failed to load winner/loser profiles:", error);
              }
            }
            
            // Set up interval to check for opponent updates
            const intervalId = setInterval(async () => {
              try {
                const updatedMatch = await getMatch(matchId);
                if (updatedMatch && updatedMatch.submissions) {
                  // Check for opponent submission
                  const opponentId = updatedMatch.player1 === currentUser?.uid ? 
                    updatedMatch.player2 : updatedMatch.player1;
                  
                  if (updatedMatch.submissions[opponentId]) {
                    // Opponent has submitted
                    const submissionTime = new Date(updatedMatch.submissions[opponentId].submissionTime)
                      .toLocaleTimeString();
                    
                    setOpponentUpdates(
                      `${opponentName} submitted their solution at ${submissionTime}.`
                    );
                    
                    // If match is completed and has a winner
                    if (updatedMatch.status === 'completed' && updatedMatch.winner) {
                      const winnerId = updatedMatch.winner;
                      const loserId = winnerId === updatedMatch.player1 ? updatedMatch.player2 : updatedMatch.player1;
                      
                      setMatchWinner(winnerId);
                      setMatchLoser(loserId);
                      setShowMatchResults(true);
                      setMatchStatus('completed');
                      
                      // Load profiles for winner and loser
                      try {
                        const { data: winnerData } = await getUserProfile(winnerId);
                        const { data: loserData } = await getUserProfile(loserId);
                        
                        if (winnerData) setWinnerProfile(winnerData);
                        if (loserData) setLoserProfile(loserData);
                        
                        // Update rank points for winner and loser if not already updated
                        if (!resultsUpdated && currentUser && !updatedMatch.pointsAwarded) {
                          try {
                            // Only update once, and only if the match hasn't been processed
                            const updateResult = await updateMatchResults(winnerId, loserId);
                            
                            if (updateResult.success) {
                              if (updateResult.alreadyProcessed) {
                                console.log("Points were already awarded for this match");
                              } else {
                                console.log("Match results updated successfully");
                              }
                              setResultsUpdated(true);
                            } else {
                              console.error("Match results update failed:", updateResult.error);
                              setSubmissionError(`Failed to update match results: ${updateResult.error}`);
                            }
                          } catch (error: any) {
                            console.error("Error updating match results:", error);
                            setSubmissionError(`Error updating match results: ${error.message}`);
                          }
                        }
                      } catch (error) {
                        console.error("Failed to load winner/loser profiles:", error);
                      }
                    }
                  }
                }
              } catch (e) {
                console.error("Error checking for match updates:", e);
              }
            }, 3000); // Check every 3 seconds
            
            // Save the interval ID for cleanup
            setCheckingInterval(intervalId);
          }
        } catch (error) {
          console.error("Failed to load match details:", error);
          setSubmissionError("Failed to load match details. Please try again.");
        }
      }
    };
    
    if (isRankedMatch && matchId && currentUser) {
      loadMatchDetails();
    }
  }, [isRankedMatch, matchId, currentUser, opponentName, resultsUpdated]);

  // Handle language change
  useEffect(() => {
    if (problemId) {
      setCode(getInitialCodeSnippet(language, problemId));
    }
  }, [language, problemId]);

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Handle match timer
  useEffect(() => {
    if (isRankedMatch && matchStatus === 'in_progress') {
      const timer = setInterval(() => {
        setMatchTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRankedMatch, matchStatus]);

  // Start timer when typing begins
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);

    if (!isTyping) {
      setIsTyping(true);
      setTimerRunning(true);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format match time for display
  const formatMatchTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle language selection
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  // Create default test cases if none exist
  const getTestCases = useCallback((): TestCase[] => {
    if (problem && problem.testCases && problem.testCases.length > 0) {
      return problem.testCases;
    }
    
    // If no test cases exist, create default ones from examples
    if (problem && problem.examples && problem.examples.length > 0) {
      return problem.examples.map((example: any, index: number) => {
        // Clean up the input and output
        const input = example.input
          .replace(/^.*=\s*/, '') // Remove variable name and equals
          .replace(/\[|\]|\"|\'/g, '') // Remove brackets and quotes
          .trim();
        
        const output = example.output
          .replace(/\[|\]|\"|\'/g, '') // Remove brackets and quotes
          .trim();
        
        return {
          input,
          expectedOutput: output,
          isHidden: false
        };
      });
    }
    
    return [];
  }, [problem]);

  // Handle code submission
  const handleSubmit = async () => {
    if (matchStatus === 'completed') {
      return; // Don't allow resubmission if already completed
    }
    
    try {
      setTimerRunning(false);
      setIsSubmitting(true);
      setSubmissionError(null);
      setSubmissionResults([]);
      setShowResults(true);
      
      const testCases = getTestCases().slice(0, 3); // Process up to 3 test cases
      
      if (testCases.length === 0) {
        setSubmissionError('No test cases available for this problem.');
        return;
      }
      
      const results = await evaluateCode(code, language, testCases);
      setSubmissionResults(results);
      
      const allPassed = results.every(result => result.status.id === statusCodes.ACCEPTED);
      const testCasesPassed = results.filter(result => result.status.id === statusCodes.ACCEPTED).length;

      if (currentUser) {
        const solveTime = Math.round((Date.now() - startTime) / 1000);

        if (isRankedMatch && matchId) {
          console.log('Submitting ranked match solution:', matchId);
          // Submit solution for ranked match
          try {
            const success = await submitMatchSolution(
              matchId,
              currentUser.uid,
              code,
              language,
              testCasesPassed,
              testCases.length
            );
            
            if (success) {
              setMatchStatus('completed');
            } else {
              setSubmissionError('Failed to submit your solution for the match. Please try again.');
            }
          } catch (error: any) {
            setSubmissionError(`Match submission error: ${error.message}`);
            console.error("Match submission error:", error);
          }
        } else if (allPassed) {
          console.log('All tests passed! Updating problem status.');
          // Update regular problem status
          try {
            const updateResult = await updateProblemSolved(currentUser.uid, problemId, solveTime);
            if (!updateResult.success) {
              console.error('Failed to update problem status:', updateResult.error);
            }
          } catch (error: any) {
            console.error("Error updating problem status:", error);
          }
        }
      }
      
    } catch (error: any) {
      setSubmissionError(error.message || 'An error occurred during submission');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button click
  const handleGoBack = () => {
    if (isRankedMatch) {
      if (window.confirm('Are you sure you want to leave the ranked match?')) {
        navigate('/ranked-match');
      }
    } else {
      navigate('/code');
    }
  };

  // Navigate to leaderboard
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Download code
  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${problem?.title.replace(/\s+/g, '_').toLowerCase() || 'solution'}.${language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Reset code to initial state
  const handleResetCode = () => {
    if (window.confirm('Are you sure you want to reset your code to the initial template?')) {
      setCode(getInitialCodeSnippet(language, problemId));
    }
  };

  // Find new match
  const handleFindNewMatch = () => {
    navigate('/ranked-match');
  };

  if (!problem) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Problem not found</p>
              <button
                onClick={handleGoBack}
                className="mt-4 flex items-center text-[var(--accent)] hover:underline"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to problems
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // Render match results overlay if the match is complete
  if (showMatchResults && matchWinner && matchLoser) {
    const isWinner = currentUser && matchWinner === currentUser.uid;
    const profileToShow = isWinner ? winnerProfile : loserProfile;
    const opponentProfile = isWinner ? loserProfile : winnerProfile;
    
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="card max-w-2xl w-full mx-auto"
            >
              <div className="text-center mb-8">
                <TrophyIcon className="text-yellow-400 mx-auto mb-4" size={64} />
                <h1 className="text-3xl font-bold mb-2">
                  Match {isWinner ? 'Won!' : 'Completed'}
                </h1>
                <p className="text-[var(--text-secondary)]">
                  {isWinner 
                    ? 'Congratulations! You won the ranked match.' 
                    : `${opponentName} won the match.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-lg ${isWinner ? 'bg-green-500 bg-opacity-20' : 'bg-[var(--primary)]'}`}>
                  <h3 className="font-bold text-lg mb-2">Your Results</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tests Passed:</span>
                      <span className="font-medium">
                        {matchDetails?.submissions[currentUser?.uid || '']?.testCasesPassed || 0}/
                        {matchDetails?.submissions[currentUser?.uid || '']?.totalTestCases || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submission Time:</span>
                      <span className="font-medium">
                        {matchDetails?.submissions[currentUser?.uid || '']
                          ? formatTime(Math.floor((matchDetails.submissions[currentUser.uid].submissionTime - matchDetails.startTime) / 1000))
                          : '00:00:00'}
                      </span>
                    </div>
                    {isWinner && (
                      <div className="flex justify-between">
                        <span>Points Earned:</span>
                        <span className="font-medium text-green-400">+1 Rank Point</span>
                      </div>
                    )}
                    {profileToShow && (
                      <div className="flex justify-between">
                        <span>Current Rank:</span>
                        <span className="font-medium">{profileToShow.stats?.rank || 'Unranked'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--primary)] p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{opponentName}'s Results</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tests Passed:</span>
                      <span className="font-medium">
                        {matchDetails?.submissions[opponent]?.testCasesPassed || 0}/
                        {matchDetails?.submissions[opponent]?.totalTestCases || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submission Time:</span>
                      <span className="font-medium">
                        {matchDetails?.submissions[opponent]
                          ? formatTime(Math.floor((matchDetails.submissions[opponent].submissionTime - matchDetails.startTime) / 1000))
                          : '00:00:00'}
                      </span>
                    </div>
                    {!isWinner && (
                      <div className="flex justify-between">
                        <span>Points Earned:</span>
                        <span className="font-medium text-green-400">+1 Rank Point</span>
                      </div>
                    )}
                    {opponentProfile && (
                      <div className="flex justify-between">
                        <span>Current Rank:</span>
                        <span className="font-medium">{opponentProfile.stats?.rank || 'Unranked'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--primary)] p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">Match Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Problem:</span>
                    <span className="font-medium">{problem.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className={`font-medium ${
                      problem.difficulty === 'Easy' ? 'text-green-400' :
                      problem.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winner:</span>
                    <span className="font-medium text-yellow-400">
                      {isWinner ? 'You' : opponentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reason:</span>
                    <span className="font-medium">
                      {(() => {
                        const myTests = matchDetails?.submissions[currentUser?.uid || '']?.testCasesPassed || 0;
                        const opponentTests = matchDetails?.submissions[opponent]?.testCasesPassed || 0;
                        
                        if (myTests !== opponentTests) {
                          return isWinner ? 
                            'More test cases passed' : 
                            'Opponent passed more test cases';
                        } else {
                          return isWinner ? 
                            'Faster submission time' : 
                            'Opponent had faster submission time';
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleViewLeaderboard}
                  className="btn-secondary flex-1 flex items-center justify-center"
                >
                  <TrophyIcon size={18} className="mr-2" />
                  View Leaderboard
                </button>
                <button 
                  onClick={handleFindNewMatch}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <Swords size={18} className="mr-2" />
                  Find New Match
                </button>
              </div>
            </motion.div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow flex flex-col md:flex-row">
          {/* Problem Description Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2 bg-[var(--secondary)] overflow-y-auto h-screen md:h-[calc(100vh-64px)]"
          >
            {isRankedMatch && (
              <div className="bg-[var(--accent)] bg-opacity-20 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Swords className="text-[var(--accent)] mr-2" size={20} />
                  <div>
                    <h3 className="font-semibold">Ranked Match</h3>
                    <p className="text-sm text-[var(--text-secondary)]">vs. {opponentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${matchTimeRemaining < 60 ? 'text-red-400 animate-pulse' : ''}`}>
                    {formatMatchTime(matchTimeRemaining)}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">Time Remaining</p>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{problem.title}</h1>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${
                      problem.difficulty === 'Easy' ? 'text-green-400' :
                      problem.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="mx-2 text-[var(--text-secondary)]">•</span>
                    <div className="flex space-x-1">
                      {problem.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="bg-[var(--primary)] text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleGoBack}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line">{problem.description}</div>
                
                {problem.examples && problem.examples.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">Examples</h2>
                    <div className="space-y-4">
                      {problem.examples.map((example: any, idx: number) => (
                        <div key={idx} className="bg-[var(--primary)] p-4 rounded-lg">
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">Constraints</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {problem.constraints.map((constraint: string, idx: number) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Opponent Updates */}
              {opponentUpdates && (
                <div className="mt-6 bg-blue-500 bg-opacity-20 text-blue-400 p-4 rounded-lg">
                  <p>{opponentUpdates}</p>
                </div>
              )}

              {/* Submission Results */}
              {showResults && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Submission Results</h2>
                  
                  {submissionError && (
                    <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-4 flex items-center">
                      <AlertCircle size={20} className="mr-2" />
                      <span>{submissionError}</span>
                    </div>
                  )}

                  {isSubmitting ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader className="animate-spin text-[var(--accent)] mr-3" size={24} />
                      <span>Running tests...</span>
                    </div>
                  ) : (
                    <>
                      {submissionResults.length > 0 && (
                        <div>
                          {submissionResults.map((result, index) => (
                            <SubmissionResult 
                              key={index} 
                              result={result} 
                              testCaseIndex={index} 
                              isHidden={getTestCases()[index]?.isHidden || false} 
                            />
                          ))}
                          
                          {/* Overall Result Summary */}
                          <div className="bg-[var(--primary)] p-4 rounded-lg">
                            <div className="flex items-center">
                              {submissionResults.every(result => result.status.id === statusCodes.ACCEPTED) ? (
                                <>
                                  <Check className="text-green-400 mr-2" size={24} />
                                  <div>
                                    <h3 className="font-semibold text-green-400">All Tests Passed!</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                      Your solution passed all {submissionResults.length} test cases.
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <X className="text-red-400 mr-2" size={24} />
                                  <div>
                                    <h3 className="font-semibold text-red-400">Tests Failed</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                      Your solution passed {submissionResults.filter(r => r.status.id === statusCodes.ACCEPTED).length} out of {submissionResults.length} test cases.
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Code Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2 bg-[var(--primary)] h-screen md:h-[calc(100vh-64px)] flex flex-col"
          >
            <div className="flex justify-between items-center bg-[var(--secondary)] p-4">
              <div className="flex items-center space-x-4">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-[var(--primary)] px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-[var(--text-secondary)]">
                  <span className="mr-1">Time:</span>
                  <span className="font-mono">{formatTime(timer)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-full hover:bg-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                  onClick={handleResetCode}
                  title="Reset code"
                >
                  <RotateCcw size={18} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                  onClick={handleCopyCode}
                  title="Copy code"
                >
                  <Copy size={18} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                  onClick={handleDownloadCode}
                  title="Download code"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
            
            {/* Improved editor container for better scrolling */}
            <div className="flex-grow overflow-y-auto" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto' }}>
                <Editor
                  value={code}
                  onValueChange={handleCodeChange}
                  highlight={(code) => 
                    highlight(
                      code, 
                      languages[language as keyof typeof languages] || languages.javascript, 
                      language || 'javascript'
                    )
                  }
                  padding={16}
                  style={{
                    fontFamily: '"Fira Code", "Menlo", monospace',
                    fontSize: 14,
                    backgroundColor: '#1a1a2e',
                    minHeight: '100%',
                    height: 'auto',
                    width: '100%',
                    overflow: 'visible'
                  }}
                  className="w-full"
                  textareaClassName="w-full overflow-y-auto"
                />
              </div>
            </div>
            
            <div className="bg-[var(--secondary)] p-3 flex justify-between items-center">
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-3 py-1 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
              >
                {timerRunning ? 'Pause Timer' : 'Resume Timer'}
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || matchStatus === 'completed'}
                className={`flex items-center bg-[var(--accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-md ${
                  isSubmitting || matchStatus === 'completed' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : matchStatus === 'completed' ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Submitted
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-1" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
};

export default CodeEditorPage;