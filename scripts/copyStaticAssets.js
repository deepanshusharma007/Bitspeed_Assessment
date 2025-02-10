const fs = require('fs-extra');
const path = require('path');

const src = path.join(__dirname, '../src/public');
const dest = path.join(__dirname, '../dist/public');

if (fs.existsSync(src)) {
    fs.copySync(src, dest, { overwrite: true });
    console.log('✅ Public folder copied successfully!');
} else {
    console.warn('⚠️ Public folder not found. Skipping copy.');
}