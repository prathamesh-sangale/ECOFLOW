import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import AccessPending from './pages/AccessPending';

const queryClient = new QueryClient();

// Placeholders for Protected routes
const Dashboard = () => <div className="p-4">Dashboard Page <LogoutBtn /></div>;
const EngineerDashboard = () => <div className="p-4">Engineer Dashboard <LogoutBtn /></div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard <LogoutBtn /></div>;
const Unauthorized = () => <div className="p-4 text-error">403 - Unauthorized Access</div>;

const LogoutBtn = () => {
  const { logout } = useAuth();
  return <button onClick={logout} className="ml-4 text-blue-500 underline">Logout</button>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/pending-approval" element={<AccessPending />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Engineer']} />}>
              <Route path="/engineer" element={<EngineerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
