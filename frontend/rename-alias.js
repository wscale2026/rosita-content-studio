import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/frontoffice/src');

function walk(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/from\s+['"]@\//g, 'from "@frontoffice/');
      content = content.replace(/import\s+['"]@\//g, 'import "@frontoffice/');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(dir);
console.log('Done replacing aliases.');
