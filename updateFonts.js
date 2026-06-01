import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sectionsDir = path.join(__dirname, 'src', 'components', 'sections');

const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace font-serif with font-script globally
  let updatedContent = content.replace(/\bfont-serif\b/g, 'font-script');
  
  // Replace inline Cormorant Garamond with Great Vibes
  updatedContent = updatedContent.replace(/'Cormorant Garamond', serif/g, "'Great Vibes', cursive");
  
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${file}`);
  }
});
