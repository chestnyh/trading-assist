import { Routes, Route, BrowserRouter} from 'react-router-dom';
import { HtmlEntryPoint } from '../features/htmlEntryPoint';
import { Main } from '../features/mainPage/Main';
import { SignUp1 } from '../features/signInUp/SignUp1';
import { SignUp2 } from '../features/signInUp/SignUp2';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HtmlEntryPoint />} />
        <Route path="/main" element={<Main />} />
        <Route path="/sign-up-1" element={<SignUp1 />} />
        <Route path='/sign-up-2' element={<SignUp2 />}/>
      </Routes>
    </BrowserRouter>
  );
}
