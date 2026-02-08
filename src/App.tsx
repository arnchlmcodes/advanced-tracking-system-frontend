import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Home from './pages/Home';
import ReportItem from './pages/ReportItem';
import MyClaims from './pages/MyClaims';
import ClaimChat from './pages/ClaimChat';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportItem />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-claims"
          element={
            <PrivateRoute>
              <MyClaims />
            </PrivateRoute>
          }
        />

        <Route
          path="/claims/:claimId/chat"
          element={
            <PrivateRoute>
              <ClaimChat />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
