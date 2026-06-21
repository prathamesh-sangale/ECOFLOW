import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import ServerError from './pages/errors/ServerError';

import Login from './pages/Login';
import AccessPending from './pages/AccessPending';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import BomList from './pages/boms/BomList';
import BomDetails from './pages/boms/BomDetails';
import EcoList from './pages/ecos/EcoList';
import EcoForm from './pages/ecos/EcoForm';
import EcoDetails from './pages/ecos/EcoDetails';
import ApprovalDashboard from './pages/approvals/ApprovalDashboard';
import ApprovalQueue from './pages/approvals/ApprovalQueue';
import ApprovalReview from './pages/approvals/ApprovalReview';
import ReleaseTracking from './pages/versions/ReleaseTracking';
import VersionHistory from './pages/versions/VersionHistory';
import VersionComparison from './pages/versions/VersionComparison';
import VersionList from './pages/versions/VersionList';
import AuditDashboard from './pages/audit/AuditDashboard';

const queryClient = new QueryClient();

import EngineerDashboard from './pages/dashboards/EngineerDashboard';
import ApproverDashboard from './pages/dashboards/ApproverDashboard';
import ProductionDashboard from './pages/dashboards/ProductionDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DashboardRouter from './pages/dashboards/DashboardRouter';
import ReportsCenter from './pages/reports/ReportsCenter';

const Unauthorized = () => <div className="p-4 text-error">403 - Unauthorized Access</div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/pending-approval" element={<AccessPending />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes Wrapped in DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/dashboard/engineer" element={<ProtectedRoute allowedRoles={['Engineer', 'Admin']}><EngineerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/approver" element={<ProtectedRoute allowedRoles={['Approver', 'Admin']}><ApproverDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/production" element={<ProtectedRoute allowedRoles={['Production Manager', 'Production', 'Admin']}><ProductionDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />

                <Route path="/products" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><ProductList /></ProtectedRoute>} />
                <Route path="/products/new" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer']}><ProductForm /></ProtectedRoute>} />
                <Route path="/products/:id/edit" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer']}><ProductForm /></ProtectedRoute>} />

                <Route path="/boms" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><BomList /></ProtectedRoute>} />
                <Route path="/boms/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><BomDetails /></ProtectedRoute>} />

                <Route path="/ecos" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><EcoList /></ProtectedRoute>} />
                <Route path="/ecos/new" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer']}><EcoForm /></ProtectedRoute>} />
                <Route path="/ecos/:id/edit" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer']}><EcoForm /></ProtectedRoute>} />
                <Route path="/ecos/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><EcoDetails /></ProtectedRoute>} />

                <Route path="/approvals/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Approver', 'Production Manager', 'Production']}><ApprovalDashboard /></ProtectedRoute>} />
                <Route path="/approvals/queue" element={<ProtectedRoute allowedRoles={['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']}><ApprovalQueue /></ProtectedRoute>} />
                <Route path="/approvals/review/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']}><ApprovalReview /></ProtectedRoute>} />

                <Route path="/releases" element={<ProtectedRoute allowedRoles={['Admin', 'Approver', 'Production Manager', 'Production']}><ReleaseTracking /></ProtectedRoute>} />
                <Route path="/versions" element={<ProtectedRoute allowedRoles={['Admin', 'Production Manager', 'Production']}><VersionList /></ProtectedRoute>} />
                <Route path="/versions/product/:productId" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><VersionHistory /></ProtectedRoute>} />
                <Route path="/versions/compare/:oldVersionId/:newVersionId" element={<ProtectedRoute allowedRoles={['Admin', 'Engineer', 'Approver', 'Production Manager', 'Production']}><VersionComparison /></ProtectedRoute>} />

                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/roles" element={<RoleManagement />} />
                  <Route path="/audit" element={<AuditDashboard />} />
                </Route>

                <Route path="/reports" element={<ProtectedRoute allowedRoles={['Admin', 'Approver', 'Production Manager', 'Production', 'Engineer']}><ReportsCenter /></ProtectedRoute>} />
              </Route>
            </Route>

            <Route path="/403" element={<Forbidden />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
