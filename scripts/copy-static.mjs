// Collects the static site into ./public for deployment (Netlify, Vercel, etc.).
import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('public', { recursive: true, force: true });
mkdirSync('public');
cpSync('index.html', 'public/index.html');
cpSync('style.css', 'public/style.css');
cpSync('dist', 'public/dist', { recursive: true });
