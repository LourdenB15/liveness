import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ApiKeys from "./pages/ApiKeys";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import Signup from "./pages/Signup";
import Users from "./pages/Users";
import Webhooks from "./pages/Webhooks";
import { api } from "./services/api";

function ProtectedRoute({ children }) {
  const user = api.auth.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/docs" element={<Documentation />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-keys"
        element={
          <ProtectedRoute>
            <ApiKeys />
          </ProtectedRoute>
        }
      />
      <Route
        path="/webhooks"
        element={
          <ProtectedRoute>
            <Webhooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
