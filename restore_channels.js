import fs from 'fs';
import path from 'path';

const lockedFile = 'src/data/lockedChannels.json';
const channelsFile = 'src/data/channels.json';
const settingsFile = 'src/data/settings.json';

const data = JSON.parse(fs.readFileSync(lockedFile, 'utf-8'));

fs.writeFileSync(channelsFile, JSON.stringify(data, null, 2));

const allowed = ["Football World Cup 2026", "Bangla", "Bangla News", "All"];
const lockedCategories = data.categories.filter(c => !allowed.includes(c));

fs.writeFileSync(settingsFile, JSON.stringify({ lockedCategories }, null, 2));

console.log('Restored channels and generated settings.json');
