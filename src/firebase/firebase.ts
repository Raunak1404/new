import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, serverTimestamp, getDocs, query, orderBy, limit, where, increment, runTransaction } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFZtEa_Gg04nCGcEnwfbrpugERQ2lvHes",
  authDomain: "coding-7b4b3.firebaseapp.com",
  projectId: "coding-7b4b3",
  storageBucket: "coding-7b4b3.firebasestorage.app",
  messagingSenderId: "647426131575",
  appId: "1:647426131575:web:dbdddaab7c395ed5b1e872",
  measurementId: "G-VJBZ5YTZ53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create initial user profile in Firestore
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      uid: userCredential.user.uid,
      email: email,
      name: "New User",
      coderName: "",
      profileImage: "",
      createdAt: serverTimestamp(),
      stats: {
        problemsSolved: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalRankPoints: 0, // For ranked matches
        rankWins: 0,
        rankMatches: 0,
        rank: "Unranked",
        lastActive: serverTimestamp()
      },
      achievements: [],
      solvedProblems: [],
      lastActive: serverTimestamp()
    });

    return { user: userCredential.user, error: null };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return { user: null, error: "Account already exists. Please log in." };
    }
    return { user: null, error: error.message };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last active timestamp
    const userRef = doc(db, "users", userCredential.user.uid);
    await updateDoc(userRef, {
      lastActive: serverTimestamp()
    });
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return { user: null, error: "No account found. Please sign up." };
    }
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    // Update last active timestamp before logging out
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        lastActive: serverTimestamp()
      });
    }
    
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      // If the profile doesn't exist, create it with default values
      const userData = {
        uid: userId,
        name: "New User",
        coderName: "",
        profileImage: "",
        createdAt: serverTimestamp(),
        stats: {
          problemsSolved: 0,
          currentStreak: 0,
          bestStreak: 0,
          totalRankPoints: 0,
          rankWins: 0,
          rankMatches: 0,
          rank: "Unranked",
          lastActive: serverTimestamp()
        },
        achievements: [],
        solvedProblems: [],
        lastActive: serverTimestamp()
      };
      
      await setDoc(docRef, userData);
      return { data: userData, error: null };
    }
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return { data: null, error: error.message };
  }
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const userRef = doc(db, "users", userId);

    // First check if the document exists
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Create the document if it doesn't exist
      await setDoc(userRef, {
        uid: userId,
        name: profileData.name || "New User",
        coderName: profileData.coderName || "",
        profileImage: profileData.profileImage || "",
        createdAt: serverTimestamp(),
        stats: {
          problemsSolved: 0,
          currentStreak: 0,
          bestStreak: 0,
          totalRankPoints: 0,
          rankWins: 0,
          rankMatches: 0,
          rank: "Unranked",
          lastActive: serverTimestamp()
        },
        achievements: [],
        solvedProblems: [],
        lastActive: serverTimestamp()
      });
    } else {
      // Update the existing document
      await updateDoc(userRef, {
        ...profileData,
        lastActive: serverTimestamp()
      });
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating user profile:", error);

    // Check for permission-denied error
    if (error.code === 'permission-denied') {
      return { 
        success: false, 
        error: "Permission denied: You don't have access to update this profile. Please check Firebase security rules."
      };
    }

    return { success: false, error: error.message };
  }
};

// Storage functions
export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }

    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${userId}_${timestamp}.${fileExtension}`;
    
    // Create reference to the file location
    const storageRef = ref(storage, `profileImages/${filename}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded file snapshot:', snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);

    // Update user profile with new image URL
    const updateResult = await updateUserProfile(userId, { profileImage: downloadURL });
    
    if (!updateResult.success) {
      throw new Error(updateResult.error || 'Failed to update profile with new image');
    }

    return { url: downloadURL, error: null };
  } catch (error: any) {
    console.error("Error uploading profile image:", error);
    
    // Handle specific Firebase storage errors
    if (error.code === 'storage/unauthorized') {
      return { url: null, error: 'Permission denied: You need to be logged in to upload images' };
    }
    if (error.code === 'storage/canceled') {
      return { url: null, error: 'Upload was cancelled' };
    }
    if (error.code === 'storage/unknown') {
      return { url: null, error: 'An unknown error occurred during upload' };
    }
    
    return { 
      url: null, 
      error: error.message || 'Failed to upload image'
    };
  }
};

// Add new function to update user's solved problems
export const updateProblemSolved = async (
  userId: string, 
  problemId: number,
  solveTime: number // in seconds
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const userData = userDoc.data();
    const solvedProblems = userData.solvedProblems || [];
    
    // Check if problem is already solved
    if (!solvedProblems.includes(problemId)) {
      // Update solved problems array
      solvedProblems.push(problemId);

      // Calculate new stats
      const problemsSolved = solvedProblems.length;

      // Update user document
      await updateDoc(userRef, {
        solvedProblems,
        'stats.problemsSolved': problemsSolved,
        lastActive: serverTimestamp()
      });
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating problem solved status:", error);
    return { success: false, error: error.message };
  }
};

// Update rank points for match winner and loser
export const updateMatchResults = async (winnerId: string, loserId: string) => {
  try {
    console.log("Updating match results - Winner:", winnerId, "Loser:", loserId);
    
    // Check if match result has already been processed by checking a specific field in the match
    const matchesRef = collection(db, 'matches');
    const recentMatches = query(matchesRef, 
      where('winner', '==', winnerId),
      where('status', '==', 'completed'),
      where('pointsAwarded', '==', true)
    );
    
    const matchesSnapshot = await getDocs(recentMatches);
    if (!matchesSnapshot.empty) {
      console.log("Match results already processed, not awarding points again");
      return { success: true, error: null, alreadyProcessed: true };
    }

    // Using a transaction to ensure atomic updates to both players
    await runTransaction(db, async (transaction) => {
      // Get winner document
      const winnerRef = doc(db, 'users', winnerId);
      const winnerDoc = await transaction.get(winnerRef);
      
      // Get loser document
      const loserRef = doc(db, 'users', loserId);
      const loserDoc = await transaction.get(loserRef);
      
      // Handle winner stats
      if (winnerDoc.exists()) {
        const winnerData = winnerDoc.data();
        const currentRankPoints = winnerData.stats?.totalRankPoints || 0;
        const rankWins = winnerData.stats?.rankWins || 0;
        const rankMatches = winnerData.stats?.rankMatches || 0;
        
        // Increment winner stats
        transaction.update(winnerRef, {
          'stats.totalRankPoints': currentRankPoints + 1,
          'stats.rankWins': rankWins + 1,
          'stats.rankMatches': rankMatches + 1,
          lastActive: serverTimestamp()
        });
      } else {
        // Create winner document if it doesn't exist
        transaction.set(winnerRef, {
          uid: winnerId,
          name: "New User",
          createdAt: serverTimestamp(),
          stats: {
            problemsSolved: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalRankPoints: 1,
            rankWins: 1,
            rankMatches: 1,
            rank: "Bronze",
            lastActive: serverTimestamp()
          },
          solvedProblems: [],
          lastActive: serverTimestamp()
        });
      }
      
      // Handle loser stats
      if (loserDoc.exists()) {
        const loserData = loserDoc.data();
        const rankMatches = loserData.stats?.rankMatches || 0;
        
        // Update loser stats - only increment matches, no point change
        transaction.update(loserRef, {
          'stats.rankMatches': rankMatches + 1,
          lastActive: serverTimestamp()
        });
      } else {
        // Create loser document if it doesn't exist
        transaction.set(loserRef, {
          uid: loserId,
          name: "New User",
          createdAt: serverTimestamp(),
          stats: {
            problemsSolved: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalRankPoints: 0,
            rankWins: 0,
            rankMatches: 1,
            rank: "Unranked",
            lastActive: serverTimestamp()
          },
          solvedProblems: [],
          lastActive: serverTimestamp()
        });
      }
    });
    
    // Mark match as having awarded points
    const matchQuery = query(matchesRef,
      where('winner', '==', winnerId),
      where('status', '==', 'completed'),
      where('pointsAwarded', '==', false)
    );
    
    const matchDocs = await getDocs(matchQuery);
    if (!matchDocs.empty) {
      for (const matchDoc of matchDocs.docs) {
        await updateDoc(matchDoc.ref, {
          pointsAwarded: true,
          pointsAwardedTimestamp: serverTimestamp()
        });
      }
    }
    
    // Update ranks for both users
    await Promise.all([
      updateUserRanks(winnerId),
      updateUserRanks(loserId)
    ]);
    
    console.log("Successfully updated winner and loser stats and ranks");
    return { success: true, error: null, alreadyProcessed: false };
  } catch (error: any) {
    console.error("Error updating match results:", error);
    return { success: false, error: error.message, alreadyProcessed: false };
  }
};

// Update user rank based on rank points
export const updateUserRanks = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const userData = userDoc.data();
    const rankPoints = userData.stats?.totalRankPoints || 0;
    let newRank = "Unranked";

    // Determine rank based on points using the thresholds
    if (rankPoints >= 100) {
      newRank = "Diamond";
    } else if (rankPoints >= 80) {
      newRank = "Platinum";
    } else if (rankPoints >= 60) {
      newRank = "Gold";
    } else if (rankPoints >= 30) {
      newRank = "Silver";
    } else if (rankPoints > 0) {
      newRank = "Bronze";
    }

    console.log(`User ${userId} has ${rankPoints} rank points, new rank: ${newRank}`);

    // Always update the rank regardless of whether it has changed
    await updateDoc(userRef, {
      'stats.rank': newRank,
      lastActive: serverTimestamp()
    });
    console.log(`Updated user ${userId} rank to ${newRank}`);

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating user rank:", error);
    return { success: false, error: error.message };
  }
};

// Get leaderboard data
export const getLeaderboard = async (category = 'global', limitCount = 10) => {
  try {
    console.log(`Getting ${category} leaderboard, limit: ${limitCount}`);
    
    const usersRef = collection(db, "users");
    let leaderboardQuery;

    if (category === 'rankPoints') {
      // For ranked matches leaderboard
      leaderboardQuery = query(
        usersRef, 
        orderBy("stats.totalRankPoints", "desc"),
        limit(limitCount)
      );
    } else {
      // For overall points leaderboard
      leaderboardQuery = query(
        usersRef, 
        orderBy("stats.problemsSolved", "desc"),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(leaderboardQuery);
    
    console.log(`Found ${querySnapshot.size} users for ${category} leaderboard`);
    
    const leaderboardData = querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Anonymous',
        coderName: data.coderName || '',
        selectedAvatar: data.selectedAvatar || 'boy1',
        rank: index + 1,
        stats: data.stats || {}
      };
    });

    return { data: leaderboardData, error: null };
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return { data: [], error: error.message };
  }
};

// Get user's rank position in leaderboard
export const getUserRankPosition = async (userId: string, category = 'global') => {
  try {
    // First get user's points
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const userPoints = category === 'rankPoints' 
      ? userData.stats?.totalRankPoints || 0
      : userData.stats?.problemsSolved || 0;
    
    // Query to find users with more points
    const usersRef = collection(db, "users");
    const pointsField = category === 'rankPoints' ? "stats.totalRankPoints" : "stats.problemsSolved";
    
    const higherPointsQuery = query(
      usersRef,
      where(pointsField, ">", userPoints)
    );
    
    const higherPointsSnapshot = await getDocs(higherPointsQuery);
    
    // User's rank is the number of users with more points + 1
    const rankPosition = higherPointsSnapshot.size + 1;
    
    return { rank: rankPosition, error: null };
  } catch (error: any) {
    console.error("Error getting user rank position:", error);
    return { rank: null, error: error.message };
  }
};

export { auth, app, db, storage };