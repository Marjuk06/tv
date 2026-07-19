import { mockChannels } from './src/data/mockChannels.js';
import fs from 'fs';

let updatedChannels = mockChannels.map(c => {
  if (c.category.toLowerCase().includes('jagobd') || c.name.toLowerCase().includes('jago')) {
    return { ...c, category: 'Bangla News' };
  }
  return c;
});

const uniqueCategories = ['All'];
for (const c of updatedChannels) {
  if (!uniqueCategories.includes(c.category)) {
    uniqueCategories.push(c.category);
  }
}

const jsContent = `export const mockChannels = ${JSON.stringify(updatedChannels, null, 2)};\n\nexport const categories = ${JSON.stringify(uniqueCategories, null, 2)};\n`;
fs.writeFileSync('src/data/mockChannels.js', jsContent);
console.log('Categories updated: ' + uniqueCategories.join(', '));
