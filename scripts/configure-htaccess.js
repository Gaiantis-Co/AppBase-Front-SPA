import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load .env
dotenv.config({ path: path.join(rootDir, '.env') });

const basePath = process.env.VITE_BASE_PATH || '/';
const htaccessPath = path.join(rootDir, 'dist', '.htaccess');

if (fs.existsSync(htaccessPath)) {
    let content = fs.readFileSync(htaccessPath, 'utf8');

    // Ensure basePath ends with a slash for RewriteBase and Rule
    const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

    console.log(`Configuring .htaccess with base path: ${normalizedBase}`);

    content = content.replace(/RewriteBase\s+\//g, `RewriteBase ${normalizedBase}`);
    content = content.replace(/RewriteRule\s+\.\s+\/index\.html/g, `RewriteRule . ${normalizedBase}index.html`);

    fs.writeFileSync(htaccessPath, content);
    console.log('.htaccess updated successfully.');
} else {
    console.error('.htaccess not found in dist folder. Make sure to run build first.');
}
