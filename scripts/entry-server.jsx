import { renderToString } from 'react-dom/server';
import App from '../src/App';

export function render(path) { return renderToString(<App path={path} />); }
