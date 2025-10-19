const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/myapp';
mongoose.connect(MONGO_URL);

// Simple Note schema
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date
});

const Note = mongoose.model('Note', noteSchema);

// Routes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const note = new Note({
    content: req.body.content,
    date: new Date()
  });
  const savedNote = await note.save();
  res.json(savedNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
