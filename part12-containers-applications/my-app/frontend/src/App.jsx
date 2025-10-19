import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/notes`)
      .then(response => setNotes(response.data));
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${API_URL}/api/notes`, { content: newNote });
    setNotes(notes.concat(response.data));
    setNewNote('');
  };

  return (
    <div>
      <h1>My Notes App</h1>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)} 
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note._id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

