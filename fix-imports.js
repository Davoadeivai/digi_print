import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components', 'ui');

// Patterns to match imports with version numbers
const patterns = [
  // Matches: from "package@1.2.3"
  { 
    regex: /from "([^@"]+)@(\d+\.\d+(\.\d+)*)"/g, 
    replace: 'from "$1"' 
  },
  // Matches: from 'package@1.2.3'
  { 
    regex: /from '([^@']+)@(\d+\.\d+(\.\d+)*)'/g, 
    replace: "from '$1'" 
  }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    patterns.forEach(({ regex, replace }) => {
      if (regex.test(content)) {
        content = content.replace(regex, replace);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(fullPath);
    }
  });
}

// Start processing from the components directory
processDirectory(componentsDir);
console.log('Import fixing complete!');
