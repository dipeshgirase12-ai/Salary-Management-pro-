import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import FloatingActionButton from './components/FloatingActionButton';
import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import Salaries from './pages/Salaries';
import AdminLogin from './pages/AdminLogin';
import { isLoggedIn, isGuestMode } from './utils/auth';

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn() && !isGuestMode()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {(isLoggedIn() || isGuestMode()) && <Navbar />}
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workers"
            element={
              <ProtectedRoute>
                <Workers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salaries"
            element={
              <ProtectedRoute>
                <Salaries />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {(isLoggedIn() || isGuestMode()) && (
          <>
            <BottomNav />
            <FloatingActionButton />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
