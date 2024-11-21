const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Server einrichten
const app = express();
app.use(bodyParser.json());

// Verbindung zur MariaDB
const db = mysql.createConnection({
    host: 'localhost', // Oder die IP deines Servers
    user: 'root',      // MariaDB-Benutzername
    password: 'password', // MariaDB-Passwort
    database: 'it_ausleihe' // Name der Datenbank
});

// Verbindung testen
db.connect(err => {
    if (err) throw err;
    console.log('Verbunden mit MariaDB!');
});

// Neue Ausleihe speichern
app.post('/add-loan', (req, res) => {
    const { firstName, lastName, className, device, returnDate, email } = req.body;

    const query = `
        INSERT INTO history (first_name, last_name, class_name, device, return_date, email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [firstName, lastName, className, device, returnDate, email], (err) => {
        if (err) return res.status(500).send('Speichern fehlgeschlagen!');
        res.status(200).send('Erfolgreich gespeichert!');
    });
});

// Historie abrufen
app.get('/get-history', (req, res) => {
    const query = 'SELECT * FROM history';

    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Abrufen fehlgeschlagen!');
        res.status(200).json(results);
    });
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
