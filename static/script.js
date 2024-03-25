document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the button
    document.getElementById('add_portfolio_entry').addEventListener('click', function() {
        // Make an AJAX request to the /add_portfolio_entry endpoint
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/add_portfolio_entry', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Redirect to /add_portfolio_entry if the request is successful
                window.location.href = '/add_portfolio_entry';
            } else {
                // Handle errors if any
                console.error('Error:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            // Handle network errors
            console.error('Request failed');
        };
        xhr.send();
    });

    // Add event listeners for investment options
	document.getElementById('add_investment').addEventListener('click', function() {
	    // Open a form for adding a new investment
	    const formWindow = window.open('', '_blank', 'width=400,height=200');

	    // Create the form elements
	    const form = document.createElement('form');
	    const nameInput = document.createElement('input');
	    nameInput.setAttribute('type', 'text');
	    nameInput.setAttribute('placeholder', 'Investment Name');
	    const submitButton = document.createElement('button');
	    submitButton.textContent = 'Submit';

	    // Add form elements to the form
	    form.appendChild(nameInput);
	    form.appendChild(submitButton);

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get form data
	        const formData = {
	            name: nameInput.value
	        };

	        // Send form data to server to add investment
	        fetch('/add_investment', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(formData)
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Investment added successfully.');
	                formWindow.close();
	            } else {
	                throw new Error('Failed to add investment.');
	            }
	        })
	        .catch(error => {
	            console.error('Error adding investment:', error);
	            alert('Failed to add investment. Please try again.');
	        });
	    });

	    // Append form to the window
	    formWindow.document.body.appendChild(form);
	});

	document.getElementById('past_entries').addEventListener('click', function() {
	    // Display past entries in a table under the .display section
	    fetch('/past_entries')
	        .then(response => response.json())
	        .then(data => {
	            // Create a table to display past entries
	            const table = document.createElement('table');
	            table.classList.add('past-entries-table');

	            // Create table headers
	            const headerRow = table.insertRow();
	            const headers = ['Date', 'Balance']; // Initial headers for Date and Balance columns
	            const investmentColumns = {}; // Object to store investment names as columns
	            data.forEach(entry => {
	                // Extract investment names from each entry
	                Object.keys(entry).forEach(key => {
	                    if (key !== 'entry_time' && key !== 'balance' && key !== 'id') {
	                        investmentColumns[key] = true; // Store unique investment names as columns
	                    }
	                });
	            });
	            headers.splice(1, 0, ...Object.keys(investmentColumns)); // Add investment names between Date and Balance

	            // Add headers to the table
	            headers.forEach(headerText => {
	                const header = document.createElement('th');
	                header.textContent = headerText;
	                headerRow.appendChild(header);
	            });

	            // Populate table with past entries
	            data.forEach(entry => {
	                const row = table.insertRow();
	                headers.forEach(headerText => {
	                    const cell = row.insertCell();
	                    if (headerText === 'Date') {
	                        cell.textContent = entry['entry_time']; // Date column
	                    } else if (headerText === 'Balance') {
	                        cell.textContent = entry['balance']; // Balance column
	                    } else if (headerText !== 'id') {
	                        cell.textContent = entry[headerText] || ''; // Investment value columns
	                    }
	                });
	            });

	            // Append table to the .display section
	            const displaySection = document.querySelector('.display');
	            displaySection.innerHTML = ''; // Clear previous content
	            displaySection.appendChild(table);
	        })
	        .catch(error => console.error('Error fetching past entries:', error));
	});
});
