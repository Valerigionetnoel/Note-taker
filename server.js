const express = require('express');
const path = require('path');
const fs = require('fs');
const uid = require('uniqid')

const dataBase = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.status(200).json(dataBase)
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.methode} request received to add a note`);
    const {title, text} = req.body
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uid()
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err){
                console.error(err);
            } else {
                const parseNotes = JSON.parse(data);
                parseNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parseNotes, null),
                    (writeErr) =>
                    writeErr
                    ? console.error(writeErr)
                    : console.info ('Successfully updated notes!')
                    );
            }
        })

        const response = {
            status: 'success',
            body: newNote
        };
        console.log(response)
        res.status(201).json(response);
    } else {
        res.status(500).json('error in posting note')
    }
});

// catch route send them the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
