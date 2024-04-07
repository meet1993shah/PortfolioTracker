document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the add_entry button
    document.getElementById('add_entry').addEventListener('click', function() {
        // Make an AJAX request to the /add_portfolio_entry endpoint
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/add_entry', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Redirect to /add_entry if the request is successful
                window.location.href = '/add_entry';
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

	// Add event listener to the update_entry button
	document.getElementById('update_entry').addEventListener('click', function() {
	    // Create a modal dialog box to fetch the entry date
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form to input the entry date
	    const form = document.createElement('form');
	    form.setAttribute('id', 'update-entry-form');
	    form.setAttribute('class', 'update-entry-form');
	    modalContent.appendChild(form);

	    // Create input field for investment name
	    const input = document.createElement('input');
	    input.setAttribute('type', 'date');
	    input.setAttribute('id', 'entry-date');
	    form.appendChild(input);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Submit';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // On form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get the entry date from the form
	        const entryDate = document.getElementById('entry-date').value;

	        // Redirect to /update_entry if the entry exists
	        fetch(`/get_entry?date=${entryDate}`)
	        .then(response => {
	            if (response.ok) {
	                window.location.href = '/update_entry?date=' + entryDate;
	            } else {
	                throw new Error('No entry data found for the specified date');
	            }
	        })
	        .catch(error => {
	            console.error('Error fetching entry data:', error);
	            alert('No entry data found for the specified date');
	            modal.style.display = 'none';
	        });
	    });
	});

    // Add event listener to the delete_entry button
    document.getElementById('delete_entry').addEventListener('click', function() {
        // Create a modal dialog box
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form
	    const form = document.createElement('form');
	    form.setAttribute('id', 'delete-entry-form');
	    form.setAttribute('class', 'delete-entry-form');
	    modalContent.appendChild(form);

	    // Create input field for investment name
	    const input = document.createElement('input');
	    input.setAttribute('type', 'date');
	    input.setAttribute('id', 'entry-date');
	    form.appendChild(input);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Submit';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get the entry date from the form
	        const entryDate = document.getElementById('entry-date').value;

	        // Send form data to server to delete entry
	        fetch('/delete_entry?date=' + entryDate, {
	            method: 'DELETE',
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Entry deleted successfully.');
	                document.body.removeChild(modal);
	            } else {
	                throw new Error('Failed to delete entry!');
	            }
	        })
	        .catch(error => {
	            console.error('Error deleting entry:', error);
	            alert('Failed to delete entry. Please try again.');
	        });
	    });
    });

	// Add event listeners for investment options
	document.getElementById('add_investment').addEventListener('click', function() {
	    // Create a modal dialog box
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form
	    const form = document.createElement('form');
	    form.setAttribute('id', 'investment-form');
	    form.setAttribute('class', 'investment-form');
	    modalContent.appendChild(form);

	    // Create input field for investment name
	    const input = document.createElement('input');
	    input.setAttribute('type', 'text');
	    input.setAttribute('placeholder', 'Investment Name');
	    input.setAttribute('id', 'investment-name');
	    form.appendChild(input);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Submit';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // Add event listener for form submission
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
	                document.body.removeChild(modal);
	            } else {
	                throw new Error('Failed to add investment.');
	            }
	        })
	        .catch(error => {
	            console.error('Error adding investment:', error);
	            alert('Failed to add investment. Please try again.');
	        });
	    });
	});

	// Add event listeners for investment options
	document.getElementById('update_investment').addEventListener('click', function() {
	    // Create a modal dialog box
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form
	    const form = document.createElement('form');
	    form.setAttribute('id', 'investment-update-form');
	    form.setAttribute('class', 'investment-update-form');
	    modalContent.appendChild(form);

	    const oldNameInput = document.createElement('input');
	    oldNameInput.setAttribute('type', 'text');
	    oldNameInput.setAttribute('placeholder', 'Old Investment Name');
	    form.appendChild(oldNameInput);

	    const newNameInput = document.createElement('input');
	    newNameInput.setAttribute('type', 'text');
	    newNameInput.setAttribute('placeholder', 'New Investment Name');
	    form.appendChild(newNameInput);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Submit';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // On submit ask for confirmation
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();
	        const oldName = oldNameInput.value.trim();
	        const newName = newNameInput.value.trim();
	        if (oldName === '' || newName === '') {
	            alert('Please fill in both fields.');
	            return;
	        }
	        if (confirm(`Are you sure you want to update '${oldName}' to '${newName}'?`)) {
	            // Send PATCH request to update investment
	            fetch('/update_investment', {
	                method: 'PATCH',
	                headers: {
	                    'Content-Type': 'application/json'
	                },
	                body: JSON.stringify({
	                    existing_name: oldName,
	                    new_name: newName
	                })
	            })
	            .then(response => {
	                if (!response.ok) {
	                    throw new Error('Failed to update investment');
	                }
	                return response.json();
	            })
	            .then(data => {
	                alert(data.message);
	                modal.remove(); // Remove modal after updating
	            })
	            .catch(error => {
	                console.error('Error updating investment:', error);
	                alert('Failed to update investment. Please try again.');
	            });
	        }
	    });
	});

	// Add event listener to the delete_investment button
    document.getElementById('delete_investment').addEventListener('click', function() {
        // Create a modal dialog box
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form
	    const form = document.createElement('form');
	    form.setAttribute('id', 'delete-investment-form');
	    form.setAttribute('class', 'delete-investment-form');
	    modalContent.appendChild(form);

	    // Create input field for investment name
	    const input = document.createElement('input');
	    input.setAttribute('type', 'text');
	    input.setAttribute('id', 'investment-name');
	    input.setAttribute('placeholder', 'Account Name');
	    form.appendChild(input);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Submit';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get the entry date from the form
	        const investmentName = document.getElementById('investment-name').value;

	        // Send form data to server to delete entry
	        fetch('/delete_investment?name=' + investmentName, {
	            method: 'DELETE',
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Investment account deleted successfully.');
	                document.body.removeChild(modal);
	            } else {
	                throw new Error('Failed to delete investment account!');
	            }
	        })
	        .catch(error => {
	            console.error('Error deleting investment account:', error);
	            alert('Failed to delete investment account. Please try again.');
	        });
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
	    	<div>
	        	<label for="entry-date">Enter Entry Date:</label>
	        	<input type="date" id="entry-date" required>
	        </div>
	    	<br>
	    	<div>
	        	<button type="submit">Submit</button>
	        </div>
	    `;
	    displaySection.appendChild(form);

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get the entry date from the form
	        const entryDate = document.getElementById('entry-date').value;

	        // Fetch data for the specified entry date
	        fetch('/get_entry?date=' + entryDate)
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

	// Add event listener for FI/RE Calculator
	document.getElementById('fire_calculator').addEventListener('click', function() {
	    const displaySection = document.querySelector('.display');
	    displaySection.innerHTML = ''; // Clear previous content

	    // Create a form to input the entry date
	    const form = document.createElement('form');
	    form.classList.add('entry-form');
	    form.innerHTML = `
	    	<div>
		    	<label for="annual-expense">Annual Expense in Retirement($):</label>
		        <input type="number" step="0.01" id="annual-expense" required>
		    </div>
		    <br>
		    <div>
		        <label for="tax-rate">Effective Tax Rate in Retirement(%):</label>
		        <input type="number" step="0.01" id="tax-rate" required>
		    </div>
		    <br>
		    <div>
		        <label for="swr">Safe Withdrawal Rate(%):</label>
		        <input type="number" step="0.01" id="swr" required>
		    </div>
		    <br>
		    <div>
	        	<button type="submit">Submit</button>
	        </div>
	    `;
	    displaySection.appendChild(form);

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get the entry date from the form
	        const annualExpense = document.getElementById('annual-expense').value;
	        const taxRate = document.getElementById('tax-rate').value;
	        const swr = document.getElementById('swr').value;

	        // Fetch data for the specified entry date
	        fetch('/fire_calculator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    annual_expense: annualExpense,
                    tax_rate: taxRate,
                    safe_withdrawal_rate: swr
                })
            })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error('Failed to fetch FIRE data');
	            }
	            return response.json();
	        })
            .then(data => {
            	// Create a table to display past entries
	            const table = document.createElement('table');
	            table.classList.add('FIRE-Calculator');

	            // Create table headers
	            const headerRow = table.insertRow();
	            const headers = ['FI/RE Field', 'FI/RE Value'];

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
	                    if (headerText === 'FI/RE Field') {
	                        cell.textContent = entry['field'];
	                    } else if (headerText === 'FI/RE Value') {
	                        cell.textContent = entry['value'];
	                    }
	                });
	            });
	            displaySection.appendChild(table);
	        })
            .catch(error => {
                console.error('Error fetching FIRE data:', error);
                alert('Failed to fetch FIRE data. Please try again.');
            })
            .finally(() => {
                // Hide the form after submission
                form.style.display = 'none';
        	});
	    });
	});

	// Add event listener for Clear Screen
    document.getElementById('clear_display').addEventListener('click', function() {
        const displaySection = document.querySelector('.display');
        displaySection.innerHTML = ''; // Clear the display content
    });

    document.getElementById('export_data').addEventListener('click', function() {
        // Create a modal dialog box
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form
	    const form = document.createElement('form');
	    form.setAttribute('id', 'export-form');
	    form.setAttribute('class', 'export-form');
	    modalContent.appendChild(form);

	    // Create input field for investment name
	    const input = document.createElement('input');
	    input.setAttribute('type', 'text');
	    input.setAttribute('placeholder', 'File Name');
	    input.setAttribute('id', 'file-name');
	    form.appendChild(input);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Export';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get form data
	        const formData = {
	            name: form.elements['file-name'].value
	        };

	        // Send form data to server to add investment
	        fetch('/export', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(formData)
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('File exported successfully.');
	                document.body.removeChild(modal);
	            } else {
	                throw new Error('Failed to export file.');
	            }
	        })
	        .catch(error => {
	            console.error('Error uploading file:', error);
	            alert('Failed to upload file to online store. Please try again.');
	        });
	    });
    });

    document.getElementById('import_data').addEventListener('click', function() {
        // Create a modal dialog box
	    const modal = document.createElement('div');
	    modal.setAttribute('class', 'modal');
	    modal.style.display = 'block';
	    document.body.appendChild(modal);

	    // Create a modal content
	    const modalContent = document.createElement('div');
	    modalContent.setAttribute('class', 'modal-content');
	    modal.appendChild(modalContent);

	    // Create a form
	    const form = document.createElement('form');
	    form.setAttribute('id', 'import-form');
	    form.setAttribute('class', 'import-form');
	    modalContent.appendChild(form);

	    // Create input field for investment name
	    const input = document.createElement('input');
	    input.setAttribute('type', 'text');
	    input.setAttribute('placeholder', 'File Name');
	    input.setAttribute('id', 'file-name');
	    form.appendChild(input);

	    // Create submit button
	    const submitButton = document.createElement('button');
	    submitButton.setAttribute('type', 'submit');
	    submitButton.innerText = 'Import';
	    form.appendChild(submitButton);

	    // Create close button
	    const closeButton = document.createElement('span');
	    closeButton.setAttribute('class', 'close');
	    closeButton.innerHTML = '&times;';
	    modalContent.appendChild(closeButton);

	    // When the user clicks on the close button, close the modal
	    closeButton.onclick = function() {
	        document.body.removeChild(modal);
	    }

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get form data
	        const formData = {
	            name: form.elements['file-name'].value
	        };

	        // Send form data to server to add investment
	        fetch('/import', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(formData)
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('File imported successfully.');
	                document.body.removeChild(modal);
	            } else {
	                throw new Error('Failed to import file.');
	            }
	        })
	        .catch(error => {
	            console.error('Error downloading file:', error);
	            alert('Failed to download file from online store. Please try again.');
	        });
	    });
    });
});
