import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CodePage from './pages/CodePage';
import CodeEditorPage from './pages/CodeEditorPage';
import QuestionOfTheDayPage from './pages/QuestionOfTheDayPage';
import RankedMatchPage from './pages/RankedMatchPage';
import StudyPage from './pages/StudyPage';
import TopicPage from './pages/TopicPage';
import LeaderboardPage from './pages/LeaderboardPage';
import StatsPage from './pages/StatsPage';
import ContactPage from './pages/ContactPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Temporarily unprotected routes for testing */}
        <Route path="/code" element={<CodePage />} />
        <Route path="/code/:id" element={<CodeEditorPage />} />
        <Route path="/question-of-the-day" element={<QuestionOfTheDayPage />} />
        <Route path="/ranked-match" element={<RankedMatchPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/study/:topic" element={<TopicPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;