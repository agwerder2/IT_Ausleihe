const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json()); // Damit wir JSON im Body der Anfragen empfangen können
app.use(cors()); // Wenn du Anfragen von einer anderen Domain zulassen willst

// MariaDB Verbindungsdetails
const db = mysql.createConnection({
  host: 'localhost', // oder die IP-Adresse deines MariaDB-Servers
  user: 'root', // Dein MariaDB-Benutzername
  password: 'Init1234', // Dein MariaDB-Passwort
  database: 'ausleihe' // Der Name der Datenbank
});

// Verbindung zur Datenbank herstellen
db.connect((err) => {
  if (err) {
    console.error('Fehler bei der Verbindung zur Datenbank: ' + err.stack);
    return;
  }
  console.log('Verbunden mit der Datenbank!');
});

// Route zum Abrufen der Ausleihhistorie
app.get('/history', (req, res) => {
  db.query('SELECT * FROM ausleihen ORDER BY date DESC', (err, results) => {
    if (err) {
      res.status(500).send('Fehler beim Abrufen der Ausleihhistorie');
    } else {
      res.json(results);
    }
  });
});

// Route zum Hinzufügen eines neuen Ausleihvorgangs
app.post('/loan', (req, res) => {
  const { username, device, returnStatus, returnDate, email, date } = req.body;
  
  const query = 'INSERT INTO ausleihen (username, device, return_status, return_date, email, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [username, device, returnStatus, returnDate, email, date];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send('Fehler beim Hinzufügen der Ausleihe');
    } else {
      res.status(201).send('Ausleihe erfolgreich hinzugefügt');
    }
  });
});

// Server starten
const port = 3000;
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
