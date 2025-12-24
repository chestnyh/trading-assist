import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HtmlEntryPoint } from '../features/htmlEntryPoint';
import { Main } from '../features/mainPage/Main';
import { SignIn } from '../features/signIn/SignIn';
import { RestorePassword1 } from '../features/restorePassword/RestorePassword1';
import { RestorePassword2 } from '../features/restorePassword/RestorePassword2';
import { RestorePassword3 } from '../features/restorePassword/RestorePassword3';
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
            <Route path='/restore-password-1' element={<RestorePassword1 />} />
            <Route path='/restore-password-2' element={<RestorePassword2 />} />
            <Route path='/restore-password-3' element={<RestorePassword3 />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path="/main" element={<Main />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
