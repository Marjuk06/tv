import { mockChannels } from './src/data/mockChannels.js';
import fs from 'fs';

const targetCategory = "Live Sports";

// Remove all channels with the specified category
const updatedChannels = mockChannels.filter(c => c.category !== targetCategory);

// Regenerate unique categories list
const uniqueCategories = ['All'];
for (const c of updatedChannels) {
  if (!uniqueCategories.includes(c.category)) {
    uniqueCategories.push(c.category);
  }
}

// Write back to mockChannels.js
const jsContent = `export const mockChannels = ${JSON.stringify(updatedChannels, null, 2)};\n\nexport const categories = ${JSON.stringify(uniqueCategories, null, 2)};\n`;
fs.writeFileSync('src/data/mockChannels.js', jsContent);

console.log('Removed all channels from category: ' + targetCategory);
console.log('Total channels remaining: ' + updatedChannels.length);
console.log('Categories updated: ' + uniqueCategories.join(', '));
