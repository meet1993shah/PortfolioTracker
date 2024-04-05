document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('update-entry-form');
    const entryTimeInput = document.getElementById('entryTimeInput');
    const investmentsContainer = document.getElementById('investmentsContainer');

    const fetchInvestments = fetch('/get_investments')
        .then(response => response.json());

    const fetchEntryData = fetch(`/get_entry?date=${entryTimeInput.value}`)
        .then(response => response.json());

    Promise.all([fetchInvestments, fetchEntryData])
        .then(([investments, entryData]) => {
            const investmentIdToNameMap = new Map();
            const investmentIdToValueMap = new Map();
            const investmentNameToIdMap = new Map();

            // Populate investments
            investments.forEach(investment => {
                investmentIdToNameMap.set(investment.id, investment.name);
                investmentNameToIdMap.set(investment.name, investment.id);
                investmentIdToValueMap.set(investment.id, 0);
            });

            // Populate existing investment amounts from entry data
            Object.keys(entryData).forEach(key => {
                investmentIdToValueMap.set(investmentNameToIdMap.get(key), entryData[key]);
            });

            // Populate form with investments
            investmentIdToNameMap.forEach(function(value, key) {
                const label = document.createElement('label');
                label.textContent = value;
                investmentsContainer.appendChild(label);

                const input = document.createElement('input');
                input.setAttribute('type', 'number');
                input.setAttribute('step', '0.01');
                input.setAttribute('placeholder', 'Enter amount');
                input.setAttribute('data-investment-id', key);
                input.value = investmentIdToValueMap.get(key);
                investmentsContainer.appendChild(input);
            });
        })
        .catch(error => console.error('Error:', error));

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const entryTime = entryTimeInput.value;
        const formData = {
            entry_time: entryTime,
            investments: {}
        };

        // Get investment amounts from input fields
        const investmentInputs = document.querySelectorAll('#investmentsContainer input');
        investmentInputs.forEach(input => {
            const investmentId = input.getAttribute('data-investment-id');
            const amount = input.value;
            formData.investments[investmentId] = amount;
        });

        fetch('/update_entry', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('Portfolio entry updated successfully.');
                window.location.href = '/'; // Redirect to homepage after successful submission
            } else {
                throw new Error('Failed to update portfolio entry.');
            }
        })
        .catch(error => {
            console.error('Error updating portfolio entry:', error);
            alert('Failed to update portfolio entry. Please try again.');
        });
    });
});
