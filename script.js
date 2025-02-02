let historyData = JSON.parse(localStorage.getItem('history')) || [];

// Event-Listener für das Formular
document.getElementById('loan-form').addEventListener('submit', handleFormSubmit);

// Initialisierung der Funktionen
renderHistory();
renderAvailableDevices();
renderCurrentLoans();

function handleFormSubmit(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const device = document.getElementById('device').value;
    const reason = document.getElementById('reason').value;
    const returnDate = document.getElementById('return-date').value;
    const inBuilding = document.getElementById('in-building').checked;
    const date = new Date().toLocaleDateString();

    if (!inBuilding) {
        alert("Bitte bestätigen, dass das Gerät das GIBZ nicht verlässt.");
        return;
    }

    if (historyData.some(item => item.device === device && item.returnStatus === "Noch in Ausleihe")) {
        alert("Dieses Gerät ist bereits ausgeliehen.");
        return;
    }

    const loan = {
        username,
        device,
        reason,
        returnStatus: "Noch in Ausleihe",
        returnDate,
        date
    };

    historyData.push(loan);
    localStorage.setItem('history', JSON.stringify(historyData));
    alert('Ausleihe erfolgreich gespeichert!');
    document.getElementById('loan-form').reset();

    renderHistory();
    renderAvailableDevices();
    renderCurrentLoans();
    renderStatistics(); 
}

function renderHistory() {
    const tbody = document.getElementById('history-table').querySelector('tbody');
    tbody.innerHTML = '';

    historyData.forEach((loan, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.username}</td>
            <td>${loan.device}</td>
            <td>${loan.reason}</td>
            <td>${loan.returnDate}</td>
            <td>${loan.date}</td>
            <td><button onclick="deleteHistoryItem(${index})">Löschen</button></td>
        `;
        tbody.appendChild(row);
    });
}

function renderAvailableDevices() {
    const deviceSelect = document.getElementById('device');
    deviceSelect.innerHTML = '<option value="">Bitte auswählen</option>';

    const allDevices = ["Laptop1", "Laptop2", "Laptop3", "Laptop4", "Laptop5", "Laptop6", "Laptop7", "Laptop8", "Laptop9", "Laptop10"];
    const unavailableDevices = historyData.filter(item => item.returnStatus === "Noch in Ausleihe").map(item => item.device);

    const availableDevices = allDevices.filter(device => !unavailableDevices.includes(device));

    availableDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device;
        option.textContent = device;
        deviceSelect.appendChild(option);
    });
}

function renderCurrentLoans() {
    const tbody = document.getElementById('current-loans-table').querySelector('tbody');
    tbody.innerHTML = '';

    historyData.filter(loan => loan.returnStatus === "Noch in Ausleihe").forEach((loan, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.username}</td>
            <td>${loan.device}</td>
            <td>${loan.returnDate}</td>
            <td><button onclick="returnDevice(${index})">Zurückgebracht</button></td>
        `;
        tbody.appendChild(row);
    });
}

function returnDevice(index) {
    // Sicherstellen, dass der Index gültig ist und das Gerät noch ausgeliehen ist
    if (historyData[index]) {
        if (historyData[index].returnStatus === "Noch in Ausleihe") {
            // Status ändern
            historyData[index].returnStatus = "Zurückgebracht";
            localStorage.setItem('history', JSON.stringify(historyData));

            // Nur verfügbare Geräte und aktuelle Ausleihen aktualisieren
            renderAvailableDevices();
            renderCurrentLoans();
        } else {
            alert("Dieses Gerät wurde bereits zurückgebracht.");
        }
    } else {
        console.error("Ungültiger Index für returnDevice:", index);
    }
}





// Funktion zum Löschen der gesamten Historie
function clearHistory() {
    if (confirm("Möchten Sie die gesamte Historie löschen?")) {
        historyData = historyData.filter(loan => loan.returnStatus === "Noch in Ausleihe");
        localStorage.setItem('history', JSON.stringify(historyData));
        renderHistory();
        renderCurrentLoans();
        renderAvailableDevices();
        renderStatistics(); 

    }
}

// Option zum Löschen von Einzel-Einträgen aus der Historie (falls gewünscht)
function deleteHistoryItem(index) {
    if (confirm("Möchten Sie diesen Ausleihvorgang löschen?")) {
        historyData.splice(index, 1);
        localStorage.setItem('history', JSON.stringify(historyData));
        renderHistory();
        renderCurrentLoans();
        renderAvailableDevices();
        renderStatistics();
    }
}


function renderStatistics() {
    const tbody = document.getElementById('stats-table').querySelector('tbody');
    tbody.innerHTML = '';

    const usernameStats = {};

    // Zähle, wie oft jedes Gerät ausgeliehen wurde
    historyData.forEach(loan => {
        if (usernameStats[loan.username]) {
            usernameStats[loan.username]++;
        } else {
            usernameStats[loan.username] = 1;
        }
    });

    // Sortiere Geräte nach der Anzahl der Ausleihen (absteigend)
    const sortedUsers = Object.keys(usernameStats).sort((a, b) => usernameStats[b] - usernameStats[a]);

    // Füge die Geräte zur Rangliste hinzu
    sortedUsers.forEach(username => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${username}</td>
            <td>${usernameStats[username]}</td>
        `;
        tbody.appendChild(row);
    });
}


function showStatistics() {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('stats-container').style.display = 'block';
    renderStatistics(); // Statistik beim Anzeigen der Statistik-Seite rendern
}
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