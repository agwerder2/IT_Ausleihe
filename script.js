let historyData = JSON.parse(localStorage.getItem('history')) || [];

document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const className = document.getElementById('class').value;
    const device = document.getElementById('device').value;
    const returnDate = document.getElementById('return-date').value;
    const returnStatus = "Noch in Ausleihe";
    const email = document.getElementById('email').value;
    const date = new Date().toLocaleDateString();

    const loan = {
        firstName,
        lastName,
        className,
        device,
        returnStatus,
        email,
        date
    };

    historyData.push(loan);
    localStorage.setItem('history', JSON.stringify(historyData));
    alert('Ausleihe gespeichert!');

    // Felder nach dem Speichern leeren
    document.getElementById('loan-form').reset();
    showHistory(); // Nach dem Speichern die Historie anzeigen
});

function showForm() {
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('history-container').style.display = 'none';
}

function showHistory() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'block';

    const historyTableBody = document.querySelector('#history-table tbody');
    historyTableBody.innerHTML = '';

    historyData.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${entry.firstName}</td>
            <td>${entry.lastName}</td>
            <td>${entry.className}</td>
            <td>${entry.device}</td>
            <td>${entry.returnStatus}</td>
            <td>${entry.email}</td>
            <td>${entry.date}</td>
            <td><button onclick="deleteHistory(${index})">Löschen</button></td>
        `;
        
        historyTableBody.appendChild(row);
    });
}

function deleteHistory(index) {
    if (confirm("Möchtest du diesen Eintrag wirklich löschen?")) {
        historyData.splice(index, 1);
        localStorage.setItem('history', JSON.stringify(historyData));
        showHistory(); // Nach dem Löschen die Historie neu anzeigen
    }
}

function clearHistory() {
    if (confirm("Möchtest du die gesamte Historie löschen?")) {
        localStorage.removeItem('history');
        historyData = [];
        showHistory(); // Nach dem Löschen die Historie leer anzeigen
    }
}
