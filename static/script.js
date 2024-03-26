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
	    // Create a modal dialog box
	    const modal = document.getElementById('modal');
	    modal.style.display = 'block';

	    // Get the close button
	    const closeButton = document.getElementsByClassName('close')[0];

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        modal.style.display = 'none';
	    }

	    // Add event listener for form submission
	    const form = document.getElementById('investment-form');
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get form data
	        const formData = {
	            name: form.elements['investment-name'].value
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
	                modal.style.display = 'none';
	            } else {
	                throw new Error('Failed to add investment.');
	            }
	        })
	        .catch(error => {
	            console.error('Error adding investment:', error);
	            alert('Failed to add investment. Please try again.');
	        });
	    });

	    // Add event listener for cancel button
	    const cancelButton = document.getElementById('cancel-button');
	    cancelButton.addEventListener('click', function() {
	        modal.style.display = 'none';
	    });
	});

	function loadPastEntries() {
		const displaySection = document.querySelector('.display');
	    displaySection.innerHTML = ''; // Clear previous content

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
	            displaySection.appendChild(table);
	        })
	        .catch(error => console.error('Error fetching past entries:', error));
	}
	document.getElementById('past_entries').addEventListener('click', loadPastEntries());

	function drawPieChart() {
		const displaySection = document.querySelector('.display');
	    displaySection.innerHTML = ''; // Clear previous content
	    // Display last entry in a pie chart
	    fetch('/last_entry')
	        .then(response => {
	            if (!response.ok) {
	                throw new Error('Failed to fetch last entry');
	            }
	            return response.json();
	        })
	        .then(data => {
	            // Extract labels and values from the last entry
	            const labels = Object.keys(data);
	            const values = Object.values(data);

	            // Create a canvas element for the pie chart
	            const canvas = document.createElement('canvas');
	            canvas.setAttribute('id', 'pieChart');
	            canvas.style.width = '80%'; // Adjust width as needed
	            canvas.style.height = '400px'; // Set a fixed height
	            displaySection.appendChild(canvas);

	            // Use Chart.js to draw the pie chart
	            new Chart(canvas, {
	                type: 'pie',
	                data: {
	                    labels: labels,
	                    datasets: [{
	                        data: values,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.7)',
	                            'rgba(54, 162, 235, 0.7)',
	                            'rgba(255, 206, 86, 0.7)',
	                            'rgba(75, 192, 192, 0.7)',
	                            'rgba(153, 102, 255, 0.7)',
	                            'rgba(255, 159, 64, 0.7)'
	                            // Add more colors if needed
	                        ],
	                        borderColor: [
	                            'rgba(255, 99, 132, 1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)',
	                            'rgba(255, 159, 64, 1)'
	                            // Add more colors if needed
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    responsive: true,
	                    title: {
	                        display: true,
	                        text: 'Last Investment Entry (Pie Chart)'
	                    }
	                }
	            });
	        })
	        .catch(error => {
	            console.error('Error fetching last entry:', error);
	            alert('Failed to fetch last entry. Please try again.');
	        });
	}
	document.getElementById('pie_chart').addEventListener('click', drawPieChart);

	// Add event listener for the "Clear Screen" button
    document.getElementById('clear_display').addEventListener('click', function() {
        const displaySection = document.querySelector('.display');
        displaySection.innerHTML = ''; // Clear the display content
    });
});
