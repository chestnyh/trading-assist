import * as ReactDOM from 'react-dom/client';

import 'jsoneditor/dist/jsoneditor.css';

import App from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
