import { renderToString } from 'react-dom/server';
import App from '../src/App';

export function render(path, content) { return renderToString(<App path={path} content={content} />); }
