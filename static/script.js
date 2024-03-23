document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for portfolio options
    document.getElementById('add_portfolio_entry').addEventListener('click', function() {
        // Open a form in a window to add a new portfolio entry
        window.open('/add_portfolio_entry_form', '_blank');
    });

    document.getElementById('update_portfolio_entry').addEventListener('click', function() {
        // Open a form in a window to update an existing portfolio entry
        window.open('/update_portfolio_entry_form', '_blank');
    });

    document.getElementById('delete_portfolio_entry').addEventListener('click', function() {
        // Open a form in a window to delete a portfolio entry
        window.open('/delete_portfolio_entry_form', '_blank');
    });

    // Add event listeners for investment options
    document.getElementById('add_investment').addEventListener('click', function() {
        // Open a form in a window to add a new investment
        window.open('/add_investment_form', '_blank');
    });

    document.getElementById('update_investment').addEventListener('click', function() {
	    // Prompt user for existing investment name
	    const existingInvestmentName = prompt('Enter the name of the existing investment:');
	    if (!existingInvestmentName) return; // Exit if user cancels or inputs empty string

	    // Prompt user for new investment name
	    const newInvestmentName = prompt('Enter the new name for the investment:');
	    if (!newInvestmentName) return; // Exit if user cancels or inputs empty string

	    // Confirm name change with user
	    const confirmMessage = `Are you sure you want to change the name of "${existingInvestmentName}" to "${newInvestmentName}"?`;
	    if (confirm(confirmMessage)) {
	        // Send request to server to update investment name
	        fetch('/update_investment', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify({
	                existingInvestmentName: existingInvestmentName,
	                newInvestmentName: newInvestmentName
	            })
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Investment name updated successfully.');
	            } else {
	                throw new Error('Failed to update investment name.');
	            }
	        })
	        .catch(error => {
	            console.error('Error updating investment name:', error);
	            alert('Failed to update investment name. Please try again.');
	        });
	    }
	});


    document.getElementById('delete_investment').addEventListener('click', function() {
        // Open a form in a window to delete an investment
        window.open('/delete_investment_form', '_blank');
    });

    // Add event listeners for visualization options
    document.getElementById('projections').addEventListener('click', function() {
        // Open a form in a window for projections
        window.open('/projections_form', '_blank');
    });

    document.getElementById('pie_charts').addEventListener('click', function() {
        // Open a form in a window for pie charts
        window.open('/pie_charts_form', '_blank');
    });

    document.getElementById('re_calculator').addEventListener('click', function() {
        // Open a form in a window for retirement goal calculator
        window.open('/re_calculator_form', '_blank');
    });

    document.getElementById('past_entries').addEventListener('click', function() {
        // Display past entries in a table
        fetch('/past_entries')
            .then(response => response.json())
            .then(data => {
                // Create a table to display past entries
                const table = document.createElement('table');
                table.classList.add('past-entries-table');
                
                // Create table headers
                const headerRow = table.insertRow();
                const headers = ['Date', 'Investments', 'Balance'];
                headers.forEach(headerText => {
                    const header = document.createElement('th');
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });
                
                // Populate table with past entries
                data.forEach(entry => {
                    const row = table.insertRow();
                    row.insertCell().textContent = entry.entry_time;
                    row.insertCell().textContent = entry.investments;
                    row.insertCell().textContent = entry.balance;
                });

                // Append table to the document body
                document.body.appendChild(table);
            })
            .catch(error => console.error('Error fetching past entries:', error));
    });
});

// document.addEventListener('DOMContentLoaded', function() {
// 	// Function to create a new entry
// 	function createEntryOnDashboard(entryId, entryContent) {
// 		const entry = document.createElement('div');
// 		entry.classList.add('entry');
// 		// Use a data attribute for the entry's ID
// 		entry.setAttribute('data-entry-id', entryId);

// 		// Create a span for the entry content (to make it non-editable by default)
// 		const entryContent = document.createElement('span');
// 		entryContent.classList.add('entry-content');
// 		entryContent.textContent = entryContent;
// 		entry.appendChild(entryContent);

// 		// Create an edit icon
// 		const editIcon = document.createElement('span');
// 		// Using the Unicode character for a pencil
// 		editIcon.innerHTML = '&#9998;';
// 		editIcon.classList.add('edit-icon');
// 		entry.appendChild(editIcon);

// 		// Make the entry content editable when the edit icon is clicked
// 		editIcon.addEventListener('click', function() {
// 			entryContent.setAttribute('contenteditable', 'true');
// 			// Focus on the content to start editing immediately
// 			entryContent.focus();
// 		});

// 		// Handle the end of editing
// 		noteContent.addEventListener('blur', function() {
// 			updateEntryContent(entryInfo.id, entryContent.textContent);
// 			// Make it non-editable again
// 			entryContent.removeAttribute('contenteditable');
// 		});

// 		// Create a delete icon
// 		const deleteIcon = document.createElement('span');
// 		// Using the Unicode character for a trashcan
// 		deleteIcon.innerHTML = '&#128465;';
// 		deleteIcon.classList.add('delete-icon');
// 		entry.appendChild(deleteIcon);

// 		// Handle the delete action when the delete icon is clicked
// 		deleteIcon.addEventListener('click', function() {
// 			deleteNoteFromServer(noteId);
// 			// Remove the entry element from the DOM
// 			entry.remove();
// 		});
// 	}

// 	document.getElementById('entryForm').addEventListener('submit', function(e) {
// 		e.preventDefault();
// 		const content = document.getElementById('entryContent').value;

// 		fetch('/entries', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ content }),
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			if(data.success) {
// 				// Add the entry to the dashboard
// 				createEntryOnDashboard(content, data.entryId);
// 				// Reset form
// 				document.getElementById('entryForm').reset();
// 			} else {
// 				console.error('failed to create entry');
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error adding entry:', error);
// 		});
// 	});

// 	// Function to update entry content after editing
// 	function updateEntryContent(entryId, newContent) {
// 		// Send the updated contnet to the server
// 		fetch(`/entries/${entryId}`, {
// 			method: 'PATCH',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ content: newContent }),
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			if(!data.success) {
// 				console.error("Failed to update entry's cotent");
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error updating entry:', error);
// 		});
// 	}

// 	// Function to delete the entry from the server
// 	function deleteEntryFromServer(entryId) {
// 		fetch(`/entries/${entryId}`, {
// 			method: 'DELETE'
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			if(!data.success) {
// 				console.error('Failed to delete entry');
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error deleting entry:', error);
// 		});
// 	}

// 	// Function to fetch and display entries from the server
// 	function fetchAndDisplayEntries() {
// 		fetch(`/entries`, {
// 			method: 'GET'
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			if(data.success) {
// 				data.entries.forEach(entry => {
// 					createEntryOnDashboard(entry.id, entry.content);
// 				});
// 			} else {
// 				console.error('failed to fetch entries');
// 			}
// 		})
// 		.catch(error => {
// 			console.error('Error fetching entries:', error);
// 		});
// 	}

// 	// Call the function to fetch and display notes on page load
// 	fetchAndDisplayEntries();
// });
