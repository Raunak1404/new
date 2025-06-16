import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../firebase/firebase';

interface UserRankCardProps {
  userId?: string; // Use current user if not provided
}

const UserRankCard: React.FC<UserRankCardProps> = ({ userId }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const id = userId || currentUser?.uid;

  // Load user stats once on mount
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await getUserProfile(id);
        if (error) {
          console.error("Error fetching user stats:", error);
          return;
        }
        
        if (data) {
          console.log("Retrieved user stats:", data.stats);
          setUserStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
    
    // No auto-refresh interval
  }, [id]);

  // Get rank icon and color - ensure these thresholds match the backend
  const getRankInfo = (rankName: string) => {
    switch (rankName) {
      case 'Diamond':
        return { icon: '💎', color: 'from-blue-500 to-purple-500', progress: 100 };
      case 'Platinum':
        return { icon: '🔷', color: 'from-cyan-400 to-blue-400', progress: 80 };
      case 'Gold':
        return { icon: '🥇', color: 'from-yellow-600 to-yellow-400', progress: 60 };
      case 'Silver':
        return { icon: '🥈', color: 'from-gray-400 to-gray-300', progress: 30 };
      case 'Bronze':
        return { icon: '🥉', color: 'from-amber-700 to-amber-500', progress: 0 };
      default:
        return { icon: '🎯', color: 'from-blue-600 to-blue-400', progress: 0 };
    }
  };

  // Calculate progress to next rank - ensure these thresholds match the backend
  const calculateProgressToNextRank = (rankPoints: number) => {
    if (rankPoints >= 100) return { nextRank: 'Master', currentProgress: 100, required: 100 }; // Already at Diamond
    if (rankPoints >= 80) return { nextRank: 'Diamond', currentProgress: (rankPoints - 80), required: 20 };
    if (rankPoints >= 60) return { nextRank: 'Platinum', currentProgress: (rankPoints - 60), required: 20 };
    if (rankPoints >= 30) return { nextRank: 'Gold', currentProgress: (rankPoints - 30), required: 30 };
    if (rankPoints > 0) return { nextRank: 'Silver', currentProgress: rankPoints, required: 30 };
    return { nextRank: 'Bronze', currentProgress: 0, required: 1 };
  };

  if (loading) {
    return (
      <div className="card text-center p-6">
        <div className="animate-spin h-8 w-8 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">Loading rank information...</p>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="card text-center p-6">
        <p className="text-sm text-[var(--text-secondary)]">No rank information available</p>
      </div>
    );
  }

  // Determine rank based on points if not set directly
  const rankPoints = userStats.totalRankPoints || 0;
  let displayRank = userStats.rank || "Unranked";
  
  // Determine rank based on points if not set directly
  if (displayRank === "Unranked" && rankPoints > 0) {
    if (rankPoints >= 100) {
      displayRank = "Diamond";
    } else if (rankPoints >= 80) {
      displayRank = "Platinum";
    } else if (rankPoints >= 60) {
      displayRank = "Gold";
    } else if (rankPoints >= 30) {
      displayRank = "Silver";
    } else {
      displayRank = "Bronze";
    }
  }
  
  const rankInfo = getRankInfo(displayRank);
  const progress = calculateProgressToNextRank(rankPoints);
  const progressPercentage = Math.min(100, Math.round((progress.currentProgress / progress.required) * 100));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Current Rank</h3>
      
      <div className="text-center mb-6">
        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-3 bg-gradient-to-br ${rankInfo.color}`}>
          <span className="text-4xl">{rankInfo.icon}</span>
        </div>
        <p className="text-xl font-bold">{displayRank}</p>
        <p className="text-sm text-[var(--text-secondary)]">
          {rankPoints} Rank Points
        </p>
      </div>
      
      {displayRank !== 'Diamond' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{progressPercentage}% to {progress.nextRank}</span>
            <span>{progress.currentProgress}/{progress.required} points</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] h-2 rounded-full`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-[var(--primary)] p-3 rounded-lg">
          <p className="text-2xl font-bold text-[var(--accent)]">{userStats.rankWins || 0}</p>
          <p className="text-xs text-[var(--text-secondary)]">Matches Won</p>
        </div>
        <div className="bg-[var(--primary)] p-3 rounded-lg">
          <p className="text-2xl font-bold text-[var(--accent)]">
            {userStats.rankMatches > 0 
              ? Math.round((userStats.rankWins / userStats.rankMatches) * 100)
              : 0}%
          </p>
          <p className="text-xs text-[var(--text-secondary)]">Win Rate</p>
        </div>
      </div>
    </div>
  );
};

export default UserRankCard;