import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Check, X, AlertCircle } from 'lucide-react';
import { Match } from '../types/match';
import { getUserProfile } from '../firebase/firebase';

interface RecentMatchCardProps {
  match: Match;
  currentUserId: string;
}

const RecentMatchCard: React.FC<RecentMatchCardProps> = ({ match, currentUserId }) => {
  const [opponent, setOpponent] = useState<string>('Opponent');
  const [loading, setLoading] = useState(true);
  
  // Determine if current user is the winner
  const isWinner = match.winner === currentUserId;
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Load opponent details once when component mounts
  useEffect(() => {
    const loadOpponent = async () => {
      try {
        const opponentId = match.player1 === currentUserId ? match.player2 : match.player1;
        const { data } = await getUserProfile(opponentId);
        
        if (data) {
          setOpponent(data.name || data.coderName || opponentId.substring(0, 8));
        }
      } catch (error) {
        console.error('Failed to load opponent details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOpponent();
  }, [match, currentUserId]);

  // Get match result metrics
  const getMetrics = () => {
    const currentUserSubmission = match.submissions[currentUserId];
    const opponentId = match.player1 === currentUserId ? match.player2 : match.player1;
    const opponentSubmission = match.submissions[opponentId];
    
    if (!currentUserSubmission || !opponentSubmission) {
      return { userTestsPassed: 0, userTotal: 0, opponentTestsPassed: 0, opponentTotal: 0 };
    }
    
    return {
      userTestsPassed: currentUserSubmission.testCasesPassed,
      userTotal: currentUserSubmission.totalTestCases,
      opponentTestsPassed: opponentSubmission.testCasesPassed,
      opponentTotal: opponentSubmission.totalTestCases
    };
  };
  
  const metrics = getMetrics();

  return (
    <div className={`p-4 rounded-lg ${isWinner ? 'bg-green-500 bg-opacity-10 border border-green-500' : 'bg-[var(--primary)]'}`}>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-[var(--accent)] rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <Swords size={16} className="text-[var(--accent)] mr-2" />
              <span className="text-sm font-medium">Match vs. {opponent}</span>
            </div>
            <div className="flex items-center">
              {isWinner ? (
                <Check size={16} className="text-green-400 mr-1" />
              ) : (
                <X size={16} className="text-red-400 mr-1" />
              )}
              <span className={`text-xs ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                {isWinner ? 'Victory' : 'Defeat'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
            <div>
              <span className="text-[var(--text-secondary)]">Your Score:</span>
              <span className="ml-1 font-medium">{metrics.userTestsPassed}/{metrics.userTotal}</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)]">Opponent:</span>
              <span className="ml-1 font-medium">{metrics.opponentTestsPassed}/{metrics.opponentTotal}</span>
            </div>
          </div>
          
          <div className="text-xs text-[var(--text-secondary)]">
            {formatDate(match.startTime)}
          </div>
          
          {isWinner && (
            <div className="mt-1 text-xs text-green-400">
              +1 Rank Point
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentMatchCard;