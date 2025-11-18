import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CVReviewer from './pages/CVReviewer';
import PersonalStatement from './pages/PersonalStatement';
import AIInterviewer from './pages/AIInterviewer';
import WorkExperience from './pages/WorkExperience';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv-reviewer"
            element={
              <ProtectedRoute>
                <CVReviewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal-statement"
            element={
              <ProtectedRoute>
                <PersonalStatement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-interviewer"
            element={
              <ProtectedRoute>
                <AIInterviewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-experience"
            element={
              <ProtectedRoute>
                <WorkExperience />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
