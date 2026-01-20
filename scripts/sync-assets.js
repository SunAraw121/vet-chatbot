import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..');
const src = path.join(root, 'frontend', 'vet-chatbot-ui', 'dist');
const dest = path.join(root, 'backend', 'public');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log('🔄 Syncing assets from frontend/dist to backend/public...');
    if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log('✅ Assets synced successfully!');
    } else {
        console.error('❌ Frontend build directory not found. Run npm run build in frontend first.');
    }
} catch (err) {
    console.error('❌ Sync failed:', err);
}
