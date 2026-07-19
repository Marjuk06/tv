import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'src', 'data', 'channels.json');
const SETTINGS_FILE = path.join(__dirname, 'src', 'data', 'settings.json');

const app = express();
app.use(cors());
app.use(express.json());

// Helper to read and write data safely
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

const readSettings = () => {
  if (!fs.existsSync(SETTINGS_FILE)) return { lockedCategories: [] };
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
};
const writeSettings = (data) => fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));

// 1. Get all active channels and categories
app.get('/api/channels', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// 2. Add a new channel
app.post('/api/channels', (req, res) => {
  try {
    const data = readData();
    const newChannel = { ...req.body, id: Math.random().toString(36).substr(2, 10) };
    data.channels.push(newChannel);
    
    // Auto-update categories
    if (!data.categories.includes(newChannel.category)) {
      data.categories.push(newChannel.category);
    }
    
    writeData(data);
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add channel' });
  }
});

// 3. Update a channel (rename, change category, logo, etc.)
app.put('/api/channels/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.channels.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Channel not found' });
    
    data.channels[index] = { ...data.channels[index], ...req.body };
    writeData(data);
    res.json(data.channels[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update channel' });
  }
});

// 4. Delete a channel
app.delete('/api/channels/:id', (req, res) => {
  try {
    const data = readData();
    data.channels = data.channels.filter(c => c.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete channel' });
  }
});

// 5. Save reordered priorities
app.post('/api/channels/reorder', (req, res) => {
  try {
    const { order } = req.body; // Array of IDs
    const data = readData();
    
    const orderedChannels = [];
    const remainingChannels = [...data.channels];

    for (const id of order) {
      const idx = remainingChannels.findIndex(c => c.id === id);
      if (idx !== -1) {
        orderedChannels.push(remainingChannels[idx]);
        remainingChannels.splice(idx, 1);
      }
    }
    orderedChannels.push(...remainingChannels); // append any missing
    
    data.channels = orderedChannels;
    writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder channels' });
  }
});

// 6. Settings
app.get('/api/settings', (req, res) => {
  try {
    res.json(readSettings());
  } catch (error) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    writeSettings(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to write settings' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Admin Backend API running on http://localhost:${PORT}`));
