import { Routes, Route, BrowserRouter} from 'react-router-dom';
import { Main } from '../features/Main';
import { SignUp } from '../features/SignUp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
