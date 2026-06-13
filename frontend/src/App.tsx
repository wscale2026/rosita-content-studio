import { Routes, Route, Navigate } from "react-router";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Prospects from "./pages/Prospects";
import Payments from "./pages/Payments";
import Emails from "./pages/Emails";
import Content from "./pages/Content";
import Settings from "./pages/Settings";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import FrontOfficeApp from "@frontoffice/App";
import PaymentSuccess from "@frontoffice/pages/PaymentSuccess";
import PaymentCancel from "@frontoffice/pages/PaymentCancel";

function RoleGuard({
  children,
  requireAdmin = false,
  requireEditor = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
}) {
  const { user, isLoading, isAdmin, isEditor } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6750A4] border-t-transparent" />
      </div>
    );
  }

  // If a role is required and user doesn't have it, redirect.
  // Note: isAdmin is inherently true if user is Propriétaire. 
  // isEditor is true if user is Admin or Propriétaire.
  if (!user || 
      (requireAdmin && !isAdmin) || 
      (requireEditor && !isEditor)) {
    return <Navigate to="/backoffice" replace />;
  }

  return <>{children}</>;
}

function ProtectedApp() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route 
          path="/prospects" 
          element={
            <RoleGuard requireEditor>
              <Prospects />
            </RoleGuard>
          } 
        />
        <Route
          path="/payments"
          element={
            <RoleGuard requireEditor>
              <Payments />
            </RoleGuard>
          }
        />
        <Route 
          path="/emails" 
          element={
            <RoleGuard requireEditor>
              <Emails />
            </RoleGuard>
          } 
        />
        <Route
          path="/content"
          element={
            <RoleGuard requireEditor>
              <Content />
            </RoleGuard>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/backoffice" replace />} />
      </Routes>
    </AuthLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FrontOfficeApp />} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/cancel" element={<PaymentCancel />} />
      <Route path="/backoffice/login" element={<Login />} />
      <Route path="/backoffice/forgot-password" element={<ForgotPassword />} />
      <Route path="/backoffice/reset-password" element={<ResetPassword />} />
      <Route path="/backoffice/*" element={<ProtectedApp />} />
    </Routes>
  );
}
