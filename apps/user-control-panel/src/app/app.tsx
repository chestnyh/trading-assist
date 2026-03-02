import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import { Main } from '../features/mainPage/Main';
import { SignIn } from '../features/signIn/SignIn';
import { RestorePassword } from '../features/restorePassword/RestorePassword';
import Dashboard from '../features/dashboard/Dashboard';
import Settings from '../features/settings/Settings';
import { SignUpProvider } from './contexts/SignUpContext';
import SignUp from '../features/signInUp/SignUp';
import { AppProviders } from './providers/AppProviders';
import { AuthRoute } from './components/AuthRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from '../features/notFound/NotFound';
import { RedirectToSignIn } from './components/RedirectToSignIn';
import { useAuth } from './contexts/AuthContext';
import { RulesPage } from '../features/rules/RulesPage';
import { AddRulePage } from '../features/rules/AddRulePage';
import { RuleDetailsPage } from '../features/rules/RuleDetailsPage';
import { UpdateRulePage } from '../features/rules/UpdateRulePage';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      {isLoading ? null : (
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/sign-in"
            element={
              <AuthRoute>
                <SignIn />
              </AuthRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthRoute>
                <SignUpProvider>
                  <SignUp />
                </SignUpProvider>
              </AuthRoute>
            }
          />
          <Route
            path="/restore-password"
            element={
              <AuthRoute>
                <RestorePassword />
              </AuthRoute>
            }
          />
          <Route path="/main" element={<Main />} />
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rules">
              <Route index element={<RulesPage />} />
              <Route path="add" element={<AddRulePage />} />
              <Route path=":id" element={<RuleDetailsPage />} />
              <Route path=":id/update" element={<UpdateRulePage />} />
            </Route>
            <Route path="/settings" element={ <Settings />}
            />
          </Route>
          <Route
            path="*"
            element={isAuthenticated ? <NotFound /> : <RedirectToSignIn />}
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppProviders>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <AppRoutes />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
