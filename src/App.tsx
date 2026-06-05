import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Import from "./pages/Import";
import Users from "./pages/Users";
import Companies from "./pages/Companies";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import AuditLogs from "./pages/AuditLogs";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/attendance"
              element={
                <MainLayout>
                  <Attendance />
                </MainLayout>
              }
            />
            <Route
              path="/reports/*"
              element={
                <MainLayout>
                  <Reports />
                </MainLayout>
              }
            />
            <Route
              path="/import"
              element={
                <MainLayout>
                  <Import />
                </MainLayout>
              }
            />
            <Route
              path="/users"
              element={
                <MainLayout>
                  <Users />
                </MainLayout>
              }
            />
            <Route
              path="/companies"
              element={
                <MainLayout>
                  <Companies />
                </MainLayout>
              }
            />
            <Route
              path="/employees"
              element={
                <MainLayout>
                  <Employees />
                </MainLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <MainLayout>
                  <AuditLogs />
                </MainLayout>
              }
            />
            <Route
              path="/notifications"
              element={
                <MainLayout>
                  <Notifications />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
