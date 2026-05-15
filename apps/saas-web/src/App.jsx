import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { mockApi } from "./services/mockApi";

function ProtectedRoute({ children }) {
  const user = mockApi.auth.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Placeholders for next steps */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              Users list coming soon
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              Logs history coming soon
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-keys"
        element={
          <ProtectedRoute>
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              API Keys management coming soon
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
