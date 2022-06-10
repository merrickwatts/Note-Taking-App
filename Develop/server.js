const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;
const app = express();

let { notes } = require('./db/db.json');
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static(__dirname + '/public'));

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
      );
    return note;
  }

function deleteNote(id, notesArray) {
  let newNotes = notesArray.filter(note => note.id !== id.toString());
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: newNotes }, null, 2)
  );
  notes = newNotes;
  return newNotes;
}

app.get('/api/notes', (req, res) => {
  let results = notes;
  res.json(results);
});

app.post('/api/notes', (req, res) => {
  req.body.id = uniqid();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  let id = req.params.id;
  deleteNote(id, notes);
  res.send('DELETE request made');
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
}) 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})  
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
  });