import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

/* Pages */
import Login from "./pages/Login";
import Home from "./pages/Home";
import ReportItem from "./pages/ReportItem";
import MyClaims from "./pages/MyClaims";
import ClaimChat from "./pages/ClaimChat";
import SuggestedMatches from "./pages/suggestedmatches";
import SaleMarketplace from "./pages/salesmarketplace";
import PurchaseResult from "./pages/purchaseResult";

/* -------- PRIVATE ROUTE -------- */

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

/* -------- APP -------- */

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/login" element={<Login />} />

        {/* ---------- PROTECTED ---------- */}
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
          path="/suggested-matches"
          element={
            <PrivateRoute>
              <SuggestedMatches />
            </PrivateRoute>
          }
        />

        <Route
          path="/sales-marketplace"
          element={
            <PrivateRoute>
              <SaleMarketplace />
            </PrivateRoute>
          }
        />

        <Route
          path="/purchase-result/:itemId"
          element={
            <PrivateRoute>
              <PurchaseResult />
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

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
