import { Routes, Route, Navigate } from "react-router";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Prospects from "./pages/Prospects";
import Payments from "./pages/Payments";
import Emails from "./pages/Emails";
import Content from "./pages/Content";
import Settings from "./pages/Settings";
import { useAuth } from "./hooks/useAuth";

function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6750A4] border-t-transparent" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prospects" element={<Prospects />} />
        <Route
          path="/payments"
          element={
            <RoleGuard allowedRoles={["admin", "viewer"]}>
              <Payments />
            </RoleGuard>
          }
        />
        <Route path="/emails" element={<Emails />} />
        <Route
          path="/content"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <Content />
            </RoleGuard>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthLayout>
  );
}
