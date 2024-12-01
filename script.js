let historyData = JSON.parse(localStorage.getItem('history')) || [];

document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const className = document.getElementById('class').value.trim();
    const device = document.getElementById('device').value;
    const reason = document.getElementById('reason').value;
    const returnDate = document.getElementById('return-date').value;
    const email = document.getElementById('email').value.trim();
    const inBuilding = document.getElementById('in-building').checked;
    const date = new Date().toLocaleDateString();

    if (!inBuilding) {
        alert("Bitte bestätigen, dass das Gerät das GIBZ nicht verlässt.");
        return;
    }

    if (historyData.filter(item => item.device === device && item.returnStatus === "Noch in Ausleihe").length >= 1) {
        alert("Dieses Gerät ist bereits ausgeliehen.");
        return;
    }

    const loan = { firstName, lastName, className, device, reason, returnStatus: "Noch in Ausleihe", returnDate, email, date };

    historyData.push(loan);
    localStorage.setItem('history', JSON.stringify(historyData));
    alert('Ausleihe erfolgreich gespeichert!');
    document.getElementById('loan-form').reset();

    // Aktualisiere Historie und Statistiken
    renderHistory();
    renderStats();
    showHistory();
});

function showForm() {
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('stats-container').style.display = 'none';
}

function showHistory() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'block';
    document.getElementById('stats-container').style.display = 'none';
    renderHistory();
}

function showStats() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('stats-container').style.display = 'block';
    renderStats();
}

function renderHistory() {
    const tbody = document.getElementById('history-table').querySelector('tbody');
    tbody.innerHTML = '';

    historyData.forEach((loan, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.firstName}</td>
            <td>${loan.lastName}</td>
            <td>${loan.className}</td>
            <td>${loan.device}</td>
            <td>${loan.reason}</td>
            <td>${loan.returnDate}</td>
            <td>${loan.email}</td>
            <td>${loan.date}</td>
            <td><button onclick="deleteLoan(${index})">Löschen</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteLoan(index) {
    historyData.splice(index, 1);
    localStorage.setItem('history', JSON.stringify(historyData));
    renderHistory();
    renderStats();
}

function renderStats() {
    const stats = historyData.reduce((acc, loan) => {
        acc.devices[loan.device] = (acc.devices[loan.device] || 0) + 1;
        acc.reasons[loan.reason] = (acc.reasons[loan.reason] || 0) + 1;
        acc.repeatUsers[loan.email] = (acc.repeatUsers[loan.email] || 0) + 1;
        return acc;
    }, { devices: {}, reasons: {}, repeatUsers: {} });

    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <h3>Gerätenutzung:</h3>
        ${Object.entries(stats.devices).map(([device, count]) => `${device}: ${count} Ausleihen`).join('<br>')}
        <h3>Gründe für Ausleihen:</h3>
        ${Object.entries(stats.reasons).map(([reason, count]) => `${reason}: ${count} Ausleihen`).join('<br>')}
        <h3>Wiederholte Nutzer:</h3>
        ${Object.entries(stats.repeatUsers).filter(([_, count]) => count > 1).map(([user, count]) => `${user}: ${count} Ausleihen`).join('<br>')}
    `;
}

function clearHistory() {
    if (confirm('Möchten Sie die gesamte Historie wirklich löschen?')) {
        historyData = [];
        localStorage.setItem('history', JSON.stringify(historyData));
        renderHistory();
        renderStats();
    }
}
