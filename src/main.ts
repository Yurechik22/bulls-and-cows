import { mountApp } from './ui/app.js';

const root = document.createElement('main');
root.className = 'app';
document.body.append(root);

mountApp(root);
