import { mockChannels, categories } from './src/data/mockChannels.js';
import fs from 'fs';

const broken = [
  // Previous
  "cpmjfczxck", "c2nvt61yf1", "c7ensbdjew", "clrd7b0hxy", "cmymiifv69",
  "c2z203yjzm", "cj7wutw6e5", "chspn5lmbg", "c1s8fdld7y", "ckw6u7ajsp",
  "cec5j5oatr", "cf73m0egfa", "curcyfry6i", "c7hd3n11qi", "c13vgv79fn",
  "c5d4riubyp", "chcke4etgr", "c54fhh93cu", "cybxcdmyfi",
  // New (kolkata bangla)
  "c6xe6siyvr", "c1rfzj3dqa", "c2lgsg9xiv", "ckrh1cq0sq", "ch62az0i07",
  "c41jt3mjqq", "cfkggz0k5d", "cf11ntmdhq",
  // New (bangla movies)
  "c8b5qlw9k9", "cr8babvdgo", "cb8g78gdyj"
];

const filtered = mockChannels.filter(c => !broken.includes(c.id));

const jsContent = `export const mockChannels = ${JSON.stringify(filtered, null, 2)};\n\nexport const categories = ${JSON.stringify(categories, null, 2)};\n`;
fs.writeFileSync('src/data/mockChannels.js', jsContent);
console.log('Removed ' + (mockChannels.length - filtered.length) + ' broken channels.');
