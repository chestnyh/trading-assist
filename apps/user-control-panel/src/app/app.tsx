import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HtmlEntryPoint } from '../features/htmlEntryPoint';
import { Main } from '../features/mainPage/Main';
import { SignUp1 } from '../features/signInUp/SignUp1';
import { SignUp2 } from '../features/signInUp/SignUp2';
import { SignUp3 } from '../features/signInUp/SignUp3';
import { SignUp4 } from '../features/signInUp/SignUp4';
import { SignIn } from '../features/signIn/SignIn';
import { RestorePassword1 } from '../features/restorePassword/RestorePassword1';
import { RestorePassword2 } from '../features/restorePassword/RestorePassword2';
import { RestorePassword3 } from '../features/restorePassword/RestorePassword3';
import ProtectedRoute from '../features/layout/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Routes>
          <Route path="/" element={<HtmlEntryPoint />} />
          <Route path="/sign-up-1" element={<SignUp1 />} />
          <Route path='/sign-up-2' element={<SignUp2 />} />
          <Route path='/sign-up-3' element={<SignUp3 />} />
          <Route path='/sign-up-4' element={<SignUp4 />} />
          <Route path='/restore-password-1' element={<RestorePassword1 />} />
          <Route path='/restore-password-2' element={<RestorePassword2 />} />
          <Route path='/restore-password-3' element={<RestorePassword3 />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
