import { createRoot } from 'react-dom/client';
import { App } from './studio/components';
import './config';

const rootElement = document.querySelector('#root') as HTMLDivElement;
const root = createRoot(rootElement);

root.render(<App />);
