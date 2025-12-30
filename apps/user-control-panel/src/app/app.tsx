import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HtmlEntryPoint } from '../features/htmlEntryPoint';
import { Main } from '../features/mainPage/Main';
import { SignIn } from '../features/signIn/SignIn';
import { RestorePassword } from '../features/restorePassword/RestorePassword';
import Dashboard from '../features/dashboard/Dashboard';
import { SignUpProvider } from './contexts/SignUpContext';
import SignUp from '../features/signInUp/SignUp';
import { AppProviders } from './providers/AppProviders';

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
          <Routes>
            <Route path="/" element={<HtmlEntryPoint />} />
            <Route
              path="/sign-up"
              element={
                <SignUpProvider>
                  <SignUp />
                </SignUpProvider>
              }
            />
            <Route path='/restore-password' element={<RestorePassword />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path="/main" element={<Main />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
