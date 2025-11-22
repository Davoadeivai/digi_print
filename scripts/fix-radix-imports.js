import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components', 'ui');

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Pattern to match @radix-ui imports with version numbers
    const importPattern = /from "(@radix-ui\/[^@"]+)(?:@[^"]+)?"/g;
    
    // Replace versioned imports with unversioned ones
    const newContent = content.replace(importPattern, 'from "$1"');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
  return false;
}

// Find and process all .tsx files in the components directory
function processComponents() {
  const files = fs.readdirSync(componentsDir);
  let count = 0;

  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(componentsDir, file);
      if (processFile(filePath)) {
        count++;
      }
    }
  });

  console.log(`\nProcessed ${count} files.`);
}

// Run the script
processComponents();
