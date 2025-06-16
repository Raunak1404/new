// This file contains the Firebase security rules that need to be added to your Firebase project
// Please copy these rules to your Firebase console in the Firestore Database > Rules section

/*
// Firestore Security Rules for Matchmaking
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all signed-in users to read and write to matchQueue
    match /matchQueue/{queueId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow all signed-in users to read, create and update matches
    match /matches/{matchId} {
      allow read, create: if request.auth != null;
      allow update: if request.auth != null;
      
      // Keep track of point awards in the match document with a pointsAwarded field
      // This way we can prevent multiple point awards for the same match
    }
    
    // User profile rules - allow any authenticated user to modify any profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Removed the restriction to only modify own profile
    }
  }
}
*/

// IMPORTANT: Go to your Firebase console and set up these collections:
// 1. 'matchQueue' - for storing matchmaking queue entries
// 2. 'matches' - for storing active and completed matches
// 3. Make sure your Firebase Authentication is enabled
// 4. Copy the rules above to your Firebase console