import { mockChannels, categories } from './src/data/mockChannels.js';
import fs from 'fs';

// Backup everything to lockedChannels.json
fs.writeFileSync('src/data/lockedChannels.json', JSON.stringify({ channels: mockChannels, categories }, null, 2));

const allowedCategories = [
  "Football World Cup 2026",
  "Bangla",
  "Bangla News"
];

// Filter channels
const filteredChannels = mockChannels.filter(c => allowedCategories.includes(c.category));

// Generate filtered categories
const filteredCategories = ['All'];
for (const c of filteredChannels) {
  if (!filteredCategories.includes(c.category)) {
    filteredCategories.push(c.category);
  }
}

// Write to active channels.json
fs.writeFileSync('src/data/channels.json', JSON.stringify({ channels: filteredChannels, categories: filteredCategories }, null, 2));

console.log('Backed up channels to lockedChannels.json');
console.log('Filtered ' + filteredChannels.length + ' active channels to channels.json');
