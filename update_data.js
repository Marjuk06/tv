import { mockChannels } from './src/data/mockChannels.js';
import fs from 'fs';

const broken = [
  "cy6flknb1p",
  "cd7l3g2lt8",
  "cu0ie1n32b",
  "cmx0i46z78",
  "ccz085g4ue",
  "cy18soshbc",
  "cmv3jyfvsa"
];

// 1. Remove specific broken channels
let updatedChannels = mockChannels.filter(c => !broken.includes(c.id));

// 2. Remove all "Bangla Music" channels
updatedChannels = updatedChannels.filter(c => c.category !== 'Bangla Music');

// 3. Move "jago bd" to "Bangla News"
updatedChannels = updatedChannels.map(c => {
  if (c.name.toLowerCase().includes('jago bd')) {
    return { ...c, category: 'Bangla News' };
  }
  return c;
});

// 4. Regenerate unique categories list
const uniqueCategories = ['All'];
for (const c of updatedChannels) {
  if (!uniqueCategories.includes(c.category)) {
    uniqueCategories.push(c.category);
  }
}

// 5. Write back to mockChannels.js
const jsContent = `export const mockChannels = ${JSON.stringify(updatedChannels, null, 2)};\n\nexport const categories = ${JSON.stringify(uniqueCategories, null, 2)};\n`;
fs.writeFileSync('src/data/mockChannels.js', jsContent);

console.log('Removed ' + broken.length + ' broken channels.');
console.log('Processed Bangla Music and Jago BD rules.');
console.log('Categories updated: ' + uniqueCategories.join(', '));
