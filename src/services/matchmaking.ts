import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { codingProblems } from '../data/codingProblems';
import { Match, MatchQueueEntry } from '../types/match';

// Get a random problem for the match
const getRandomProblem = () => {
  const randomIndex = Math.floor(Math.random() * codingProblems.length);
  return codingProblems[randomIndex].id;
};

// Join matchmaking queue
export const joinMatchmaking = async (userId: string): Promise<string> => {
  try {
    console.log('Joining matchmaking for user:', userId);
    
    // Check if user is already in queue
    const queueRef = collection(db, 'matchQueue');
    const existingQuery = query(queueRef, where('userId', '==', userId));
    const existingDocs = await getDocs(existingQuery);

    if (!existingDocs.empty) {
      console.log('User is already in queue');
      return 'waiting'; // Return waiting instead of throwing error
    }

    // Check if user is already in an active match
    const matchesRef = collection(db, 'matches');
    const player1Query = query(
      matchesRef,
      where('player1', '==', userId),
      where('status', 'in', ['matched', 'in_progress'])
    );
    const player2Query = query(
      matchesRef,
      where('player2', '==', userId),
      where('status', 'in', ['matched', 'in_progress'])
    );
    
    const [player1Matches, player2Matches] = await Promise.all([
      getDocs(player1Query),
      getDocs(player2Query)
    ]);

    if (!player1Matches.empty || !player2Matches.empty) {
      // User is already in a match
      const match = !player1Matches.empty ? 
        player1Matches.docs[0] : player2Matches.docs[0];
      
      console.log('User is already in match:', match.id);
      return match.id;
    }

    // Look for waiting players
    const waitingQuery = query(queueRef, where('status', '==', 'waiting'));
    const waitingDocs = await getDocs(waitingQuery);
    
    console.log('Found waiting players:', waitingDocs.size);

    if (waitingDocs.empty) {
      // No waiting players, add to queue
      console.log('No waiting players, adding to queue');
      const queueEntry: MatchQueueEntry = {
        userId,
        timestamp: Date.now(),
        status: 'waiting'
      };
      
      // Add to queue - IMPORTANT: Create the document with addDoc rather than setDoc
      const docRef = await addDoc(queueRef, queueEntry);
      console.log('Added to queue with ID:', docRef.id);
      return 'waiting';
    }

    // Find first player that isn't current user
    let opponentDoc = null;
    for (const doc of waitingDocs.docs) {
      const data = doc.data() as MatchQueueEntry;
      if (data.userId !== userId) {
        opponentDoc = doc;
        break;
      }
    }

    if (!opponentDoc) {
      // No valid opponent found, add to queue
      console.log('No valid opponent, adding to queue');
      const queueEntry: MatchQueueEntry = {
        userId,
        timestamp: Date.now(),
        status: 'waiting'
      };
      const docRef = await addDoc(queueRef, queueEntry);
      console.log('Added to queue with ID:', docRef.id);
      return 'waiting';
    }

    // Found a match, create match document
    const opponentData = opponentDoc.data() as MatchQueueEntry;
    const opponentId = opponentData.userId;
    console.log('Found opponent:', opponentId);

    // Update opponent status to 'matched' to prevent double-matching
    await updateDoc(opponentDoc.ref, { status: 'matched' });
    console.log('Updated opponent status to matched');

    // Create match document
    const problem = getRandomProblem();
    console.log('Selected problem:', problem);
    
    const match: Omit<Match, 'id'> = {
      player1: opponentId,
      player2: userId,
      problemId: problem,
      startTime: Date.now(),
      status: 'matched',
      submissions: {},
      pointsAwarded: false
    };

    const matchRef = await addDoc(matchesRef, match);
    console.log('Created match with ID:', matchRef.id);
    
    // Now that match is created, remove opponent from queue
    await deleteDoc(opponentDoc.ref);
    console.log('Removed opponent from queue');
    
    return matchRef.id;
  } catch (error: any) {
    console.error('Error joining matchmaking:', error);
    throw new Error(`Matchmaking error: ${error.message}`);
  }
};

// Listen for match updates
export const listenForMatch = (
  userId: string, 
  onMatchFound: (match: Match) => void,
  onMatchUpdate: (match: Match) => void
) => {
  console.log('Setting up match listeners for user:', userId);
  
  // Create an array to store all unsubscribe functions
  const unsubscribeFunctions: (() => void)[] = [];
  
  try {
    // Listen to matches where user is player1
    const matchesRef = collection(db, 'matches');
    const player1Query = query(
      matchesRef,
      where('player1', '==', userId),
      where('status', 'in', ['matched', 'in_progress'])
    );
    
    const unsubscribePlayer1 = onSnapshot(player1Query, (snapshot) => {
      console.log('Player1 query snapshot size:', snapshot.size);
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const match = { id: change.doc.id, ...change.doc.data() } as Match;
          console.log('Found match as player1:', match);
          
          if (match.status === 'matched') {
            onMatchFound(match);
          } else {
            onMatchUpdate(match);
          }
        }
      });
    }, error => {
      console.error('Error in player1 listener:', error);
    });
    
    unsubscribeFunctions.push(unsubscribePlayer1);
    
    // Listen to matches where user is player2
    const player2Query = query(
      matchesRef,
      where('player2', '==', userId),
      where('status', 'in', ['matched', 'in_progress'])
    );
    
    const unsubscribePlayer2 = onSnapshot(player2Query, (snapshot) => {
      console.log('Player2 query snapshot size:', snapshot.size);
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const match = { id: change.doc.id, ...change.doc.data() } as Match;
          console.log('Found match as player2:', match);
          
          if (match.status === 'matched') {
            onMatchFound(match);
          } else {
            onMatchUpdate(match);
          }
        }
      });
    }, error => {
      console.error('Error in player2 listener:', error);
    });
    
    unsubscribeFunctions.push(unsubscribePlayer2);
    
    // Also listen for completed matches for this user by using a simpler query
    // This avoids the need for a composite index on status and winner
    const player1CompletedQuery = query(
      matchesRef,
      where('player1', '==', userId),
      where('status', '==', 'completed')
    );
    
    const unsubscribePlayer1Completed = onSnapshot(player1CompletedQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const match = { id: change.doc.id, ...change.doc.data() } as Match;
          // Only notify if there's a winner
          if (match.winner) {
            console.log('Detected completed match as player1:', match);
            onMatchUpdate(match);
          }
        }
      });
    }, error => {
      console.error('Error in player1 completed matches listener:', error);
    });
    
    unsubscribeFunctions.push(unsubscribePlayer1Completed);
    
    // Listen for completed matches where user is player2
    const player2CompletedQuery = query(
      matchesRef,
      where('player2', '==', userId),
      where('status', '==', 'completed')
    );
    
    const unsubscribePlayer2Completed = onSnapshot(player2CompletedQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const match = { id: change.doc.id, ...change.doc.data() } as Match;
          // Only notify if there's a winner
          if (match.winner) {
            console.log('Detected completed match as player2:', match);
            onMatchUpdate(match);
          }
        }
      });
    }, error => {
      console.error('Error in player2 completed matches listener:', error);
    });
    
    unsubscribeFunctions.push(unsubscribePlayer2Completed);
  } catch (error) {
    console.error('Error setting up match listeners:', error);
  }
  
  // Return combined unsubscribe function
  return () => {
    console.log('Unsubscribing from all match listeners');
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
  };
};

// Get match by ID
export const getMatch = async (matchId: string): Promise<Match | null> => {
  try {
    const matchRef = doc(db, 'matches', matchId);
    const matchSnap = await getDoc(matchRef);
    
    if (matchSnap.exists()) {
      return { id: matchSnap.id, ...matchSnap.data() } as Match;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting match:', error);
    return null;
  }
};

// Submit solution for a match
export const submitMatchSolution = async (
  matchId: string,
  userId: string,
  code: string,
  language: string,
  testCasesPassed: number,
  totalTestCases: number
) => {
  try {
    console.log('Submitting solution for match:', matchId, 'user:', userId);
    
    const matchRef = doc(db, 'matches', matchId);
    const submission = {
      code,
      language,
      submissionTime: Date.now(),
      testCasesPassed,
      totalTestCases
    };

    // Get current match data
    const matchSnap = await getDoc(matchRef);
    if (!matchSnap.exists()) {
      console.error('Match not found');
      return false;
    }

    const matchData = matchSnap.data() as Omit<Match, 'id'>;
    
    // Verify that the user is part of the match
    if (matchData.player1 !== userId && matchData.player2 !== userId) {
      console.error('User is not part of this match');
      return false;
    }
    
    const newSubmissions = {
      ...matchData.submissions,
      [userId]: submission
    };

    // Check if both players have submitted
    const player1Submitted = newSubmissions[matchData.player1] !== undefined;
    const player2Submitted = newSubmissions[matchData.player2] !== undefined;
    
    let newStatus = matchData.status;
    if (matchData.status !== 'completed') {
      newStatus = 'in_progress';
    }
    
    let winner = undefined;
    
    if (player1Submitted && player2Submitted) {
      newStatus = 'completed';
      
      // Determine winner based on test cases passed and time
      const p1Sub = newSubmissions[matchData.player1];
      const p2Sub = newSubmissions[matchData.player2];
      
      if (p1Sub.testCasesPassed > p2Sub.testCasesPassed) {
        winner = matchData.player1;
      } else if (p2Sub.testCasesPassed > p1Sub.testCasesPassed) {
        winner = matchData.player2;
      } else {
        // If test cases are equal, faster submission wins
        winner = p1Sub.submissionTime < p2Sub.submissionTime ? matchData.player1 : matchData.player2;
      }
      
      console.log('Match completed, winner:', winner);
    }

    // Update match document - ensure pointsAwarded is false by default
    await updateDoc(matchRef, {
      submissions: newSubmissions,
      status: newStatus,
      ...(winner && { winner }),
      pointsAwarded: matchData.pointsAwarded || false
    });

    return true;
  } catch (error) {
    console.error('Error submitting solution:', error);
    return false;
  }
};

// Cancel matchmaking
export const cancelMatchmaking = async (userId: string) => {
  try {
    console.log('Canceling matchmaking for user:', userId);
    
    // Find all queue entries for this user
    const queueRef = collection(db, 'matchQueue');
    const queueQuery = query(queueRef, where('userId', '==', userId));
    const queueDocs = await getDocs(queueQuery);

    if (!queueDocs.empty) {
      for (const doc of queueDocs.docs) {
        await deleteDoc(doc.ref);
        console.log('Deleted queue entry:', doc.id);
      }
      return true;
    }
    
    console.log('No queue entries found for user');
    return true;
  } catch (error) {
    console.error('Error canceling matchmaking:', error);
    return false;
  }
};

// Get recent matches for a user
export const getUserRecentMatches = async (userId: string, limit = 5) => {
  try {
    const matchesRef = collection(db, 'matches');
    
    // Get matches where user is either player1 or player2
    const player1Query = query(
      matchesRef,
      where('player1', '==', userId),
      where('status', '==', 'completed')
    );
    
    const player2Query = query(
      matchesRef,
      where('player2', '==', userId),
      where('status', '==', 'completed')
    );
    
    const [player1Matches, player2Matches] = await Promise.all([
      getDocs(player1Query),
      getDocs(player2Query)
    ]);
    
    // Combine matches and sort by start time
    const allMatches: Match[] = [];
    
    player1Matches.forEach(doc => {
      allMatches.push({ id: doc.id, ...doc.data() } as Match);
    });
    
    player2Matches.forEach(doc => {
      allMatches.push({ id: doc.id, ...doc.data() } as Match);
    });
    
    // Sort by start time descending (newest first)
    allMatches.sort((a, b) => b.startTime - a.startTime);
    
    // Return the most recent matches
    return allMatches.slice(0, limit);
  } catch (error) {
    console.error('Error getting user matches:', error);
    return [];
  }
};