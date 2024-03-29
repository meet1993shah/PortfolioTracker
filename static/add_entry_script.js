document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('portfolioEntryForm');

    // Fetch investments from server and populate form
    fetch('/get_investments')
        .then(response => response.json())
        .then(investments => {
            const investmentsContainer = document.getElementById('investmentsContainer');
            investments.forEach(investment => {
                // Create input field for each investment
                const label = document.createElement('label');
                label.textContent = investment.name;
                const input = document.createElement('input');
                input.setAttribute('type', 'number');
                input.setAttribute('placeholder', 'Enter amount');
                input.setAttribute('data-investment-id', investment.id);
                investmentsContainer.appendChild(label);
                investmentsContainer.appendChild(input);
            });
        })
        .catch(error => console.error('Error fetching investments:', error));

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const entryTime = document.getElementById('entryTimeInput').value;
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

        fetch('/add_entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert('Portfolio entry added successfully.');
                window.location.href = '/'; // Redirect to homepage after successful submission
            } else {
                throw new Error('Failed to add portfolio entry.');
            }
        })
        .catch(error => {
            console.error('Error adding portfolio entry:', error);
            alert('Failed to add portfolio entry. Please try again.');
        });
    });
});
