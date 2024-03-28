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

	// Add event listener for past entries
	document.getElementById('past_entries').addEventListener('click', function() {
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
	});

	// Add event listener for Pie Chart
	document.getElementById('pie_chart').addEventListener('click', function() {
	    const displaySection = document.querySelector('.display');
	    displaySection.innerHTML = ''; // Clear previous content

	    // Create a form to input the entry date
	    const form = document.createElement('form');
	    form.classList.add('entry-form');
	    form.innerHTML = `
	        <label for="entry-date">Enter Entry Date:</label>
	        <input type="date" id="entry-date" required>
	        <button type="submit">Submit</button>
	    `;
	    displaySection.appendChild(form);

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get the entry date from the form
	        const entryDate = document.getElementById('entry-date').value;

	        // Fetch data for the specified entry date
	        fetch('/entry_data?date=' + entryDate)
	            .then(response => {
	                if (!response.ok) {
	                    throw new Error('Failed to fetch data for the specified date');
	                }
	                return response.json();
	            })
	            .then(data => {
	                // Extract labels and values from the data
	                const labels = Object.keys(data);
	                const values = Object.values(data);

	                // Create a canvas element for the pie chart
	                const canvas = document.createElement('canvas');
	                canvas.setAttribute('id', 'pieChart');
	                canvas.style.backgroundColor = 'seagreen';
	                displaySection.appendChild(canvas);

	                // Use Chart.js to draw the pie chart
	                new Chart(canvas, {
	                    type: 'pie',
	                    data: {
	                        labels: labels,
	                        datasets: [{
	                            data: values,
	                            backgroundColor: [
	                                'red',
	                                'yellow',
	                                'blue',
	                                'green',
	                                'orange',
	                                'white',
	                                'purple',
	                                'lime',
	                                'pink',
	                                'gray',
	                                'violet'
	                                // Add more colors if needed
	                            ],
	                            borderColor: [
	                                'black'
	                            ],
	                            borderWidth: 2
	                        }]
	                    },
	                    options: {
	                        responsive: true,
	                        title: {
	                            display: true,
	                            text: 'Investment Distribution (Pie Chart)',
	                        },
                            plugins: {
					            legend: {
					                labels: {
					                    font: {
					                        size: 14,
					                        weight: 'bold',
					                    },
					                    color: 'white'
					                }
					            }
					        }
	                    }
	                });
	            })
	            .catch(error => {
	                console.error('Error fetching data for the specified date:', error);
	                alert('Failed to fetch data for the specified date. Please try again.');
	            })
	            .finally(() => {
	                // Hide the form after submission
	                form.style.display = 'none';
            	});
	    });
	});

	// Add event listener for Projection
	document.getElementById('projection').addEventListener('click', function() {
	    const displaySection = document.querySelector('.display');
	    displaySection.innerHTML = ''; // Clear previous content

	    // Fetch projection data from the server
	    fetch('/projection')
	        .then(response => {
	            if (!response.ok) {
	                throw new Error('Failed to fetch projection data');
	            }
	            return response.json();
	        })
	        .then(data => {
	            const xData = data['X_data'];
	            const xLabels = data['X_labels'];
	            const yData = data['Y_data'];

	            // Create canvas element for the line chart
	            const canvas = document.createElement('canvas');
	            canvas.setAttribute('id', 'lineChart');
	            canvas.style.backgroundColor = 'seagreen';
	            displaySection.appendChild(canvas);

	            // Use Chart.js to draw the line chart
	            new Chart(canvas, {
	                type: 'line',
	                data: {
	                	labels: xLabels,
	                    datasets: [{
	                        label: 'Balance',
	                        data: yData,
	                        fill: true,
	                        borderColor: 'green', // Color of the line
	                        backgroundColor: 'lightgreen',
	                        borderWidth: 2
	                    }]
	                },
	                options: {
	                    responsive: true,
	                    title: {
	                        display: true,
	                        text: 'Balance Projection Over Time',
	                        fontSize: 14,
	                        fontColor: 'red',
	                        fontWeight: 'bold'
	                    },
	                    plugins: {
	                        legend: {
	                            labels: {
	                                font: {
	                                    size: 14,
	                                    weight: 'bold',
	                                },
	                                color: 'white'
	                            }
	                        }
	                    },
	                    scales: {
	                        x: {
	                        	grid: {
	                                color: 'white'
	                            },
	                            ticks: {
	                                color: 'white',
	                            }
	                        },
	                        y: {
	                        	type: 'logarithmic',
	                            grid: {
	                                color: 'white'
	                            },
	                            ticks: {
	                                color: 'white'
	                            }
	                        }
	                    }
	                }
	            });
	        })
	        .catch(error => {
	            console.error('Error fetching projection data:', error);
	            alert('Failed to fetch projection data. Please try again.');
	        });
	});

	// Add event listener for Clear Screen
    document.getElementById('clear_display').addEventListener('click', function() {
        const displaySection = document.querySelector('.display');
        displaySection.innerHTML = ''; // Clear the display content
    });
});
