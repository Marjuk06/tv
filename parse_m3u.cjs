const fs = require('fs');

function parseM3U(content) {
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF:')) {
      // Parse tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      if (logoMatch) currentChannel.logo = logoMatch[1];
      
      // Parse group-title (category)
      const groupMatch = line.match(/group-title="([^"]+)"/);
      if (groupMatch) {
        currentChannel.category = groupMatch[1];
      } else {
        currentChannel.category = 'Other';
      }

      // Parse name (after the last comma)
      const commaSplit = line.split(',');
      if (commaSplit.length > 1) {
        currentChannel.name = commaSplit[commaSplit.length - 1].trim();
      } else {
        currentChannel.name = 'Unknown Channel';
      }
    } else if (line && !line.startsWith('#')) {
      if (line.startsWith('http')) {
        currentChannel.url = line;
        currentChannel.id = 'c' + Math.random().toString(36).substr(2, 9);
        channels.push({ ...currentChannel });
        currentChannel = {};
      }
    }
  }

  return channels;
}

const m3uContent = fs.readFileSync('playlist.m3u', 'utf-8');
const channels = parseM3U(m3uContent);

// Get unique categories
const categories = ['All', ...new Set(channels.map(c => c.category))];

const jsContent = `export const mockChannels = ${JSON.stringify(channels, null, 2)};\n\nexport const categories = ${JSON.stringify(categories)};\n`;
fs.writeFileSync('src/data/mockChannels.js', jsContent);
console.log('Successfully parsed ' + channels.length + ' channels.');
