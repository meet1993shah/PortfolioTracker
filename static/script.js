document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for portfolio options
	document.getElementById('add_portfolio_entry').addEventListener('click', function() {
	    // Open a form for adding a new portfolio entry
	    const formWindow = window.open('', '_blank', 'width=400,height=300');

	    // Create the form elements
	    const form = document.createElement('form');
	    const entryTimeInput = document.createElement('input');
	    entryTimeInput.setAttribute('type', 'date');
	    entryTimeInput.setAttribute('placeholder', 'Entry Time');
	    const investmentsInput = document.createElement('input');
	    investmentsInput.setAttribute('type', 'text');
	    investmentsInput.setAttribute('placeholder', 'Investments');
	    const balanceInput = document.createElement('input');
	    balanceInput.setAttribute('type', 'number');
	    balanceInput.setAttribute('placeholder', 'Balance');
	    const submitButton = document.createElement('button');
	    submitButton.textContent = 'Submit';

	    // Add form elements to the form
	    form.appendChild(entryTimeInput);
	    form.appendChild(investmentsInput);
	    form.appendChild(balanceInput);
	    form.appendChild(submitButton);

	    // Add event listener for form submission
	    form.addEventListener('submit', function(event) {
	        event.preventDefault();

	        // Get form data
	        const formData = {
	            entry_time: entryTimeInput.value,
	            investments: investmentsInput.value,
	            balance: balanceInput.value
	        };

	        // Send form data to server
	        fetch('/add_portfolio_entry', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(formData)
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Portfolio entry added successfully.');
	                formWindow.close();
	            } else {
	                throw new Error('Failed to add portfolio entry.');
	            }
	        })
	        .catch(error => {
	            console.error('Error adding portfolio entry:', error);
	            alert('Failed to add portfolio entry. Please try again.');
	        });
	    });

	    // Append form to the window
	    formWindow.document.body.appendChild(form);
	});

	document.getElementById('update_portfolio_entry').addEventListener('click', function() {
	    // Prompt user for entry date to update
	    const entryDate = prompt('Enter the date of the entry to update (YYYY-MM-DD):');
	    if (!entryDate) return; // Exit if user cancels or inputs empty string

	    // Fetch existing portfolio entry data
	    fetch(`/get_portfolio_entry?entryDate=${entryDate}`)
	        .then(response => response.json())
	        .then(data => {
	            // Open a form for updating the portfolio entry
	            const formWindow = window.open('', '_blank', 'width=400,height=300');

	            // Create the form elements
	            const form = document.createElement('form');
	            const investmentsInput = document.createElement('input');
	            investmentsInput.setAttribute('type', 'text');
	            investmentsInput.setAttribute('placeholder', 'Investments');
	            investmentsInput.value = data.investments;
	            const balanceInput = document.createElement('input');
	            balanceInput.setAttribute('type', 'number');
	            balanceInput.setAttribute('placeholder', 'Balance');
	            balanceInput.value = data.balance;
	            const submitButton = document.createElement('button');
	            submitButton.textContent = 'Submit';

	            // Add form elements to the form
	            form.appendChild(investmentsInput);
	            form.appendChild(balanceInput);
	            form.appendChild(submitButton);

	            // Add event listener for form submission
	            form.addEventListener('submit', function(event) {
	                event.preventDefault();

	                // Get form data
	                const formData = {
	                    investments: investmentsInput.value,
	                    balance: balanceInput.value
	                };

	                // Send form data to server to update portfolio entry
	                fetch(`/update_portfolio_entry?entryDate=${entryDate}`, {
	                    method: 'PUT',
	                    headers: {
	                        'Content-Type': 'application/json'
	                    },
	                    body: JSON.stringify(formData)
	                })
	                .then(response => {
	                    if (response.ok) {
	                        alert('Portfolio entry updated successfully.');
	                        formWindow.close();
	                    } else {
	                        throw new Error('Failed to update portfolio entry.');
	                    }
	                })
	                .catch(error => {
	                    console.error('Error updating portfolio entry:', error);
	                    alert('Failed to update portfolio entry. Please try again.');
	                });
	            });

	            // Append form to the window
	            formWindow.document.body.appendChild(form);
	        })
	        .catch(error => {
	            console.error('Error fetching portfolio entry:', error);
	            alert('Failed to fetch portfolio entry. Please try again.');
	        });
	});

	document.getElementById('delete_portfolio_entry').addEventListener('click', function() {
	    // Prompt user for entry date to delete
	    const entryDate = prompt('Enter the date of the entry to delete (YYYY-MM-DD):');
	    if (!entryDate) return; // Exit if user cancels or inputs empty string

	    // Confirm deletion with user
	    const confirmMessage = `Are you sure you want to delete the portfolio entry for ${entryDate}?`;
	    if (confirm(confirmMessage)) {
	        // Send request to server to delete portfolio entry
	        fetch(`/delete_portfolio_entry?entryDate=${entryDate}`, {
	            method: 'DELETE'
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Portfolio entry deleted successfully.');
	            } else {
	                throw new Error('Failed to delete portfolio entry.');
	            }
	        })
	        .catch(error => {
	            console.error('Error deleting portfolio entry:', error);
	            alert('Failed to delete portfolio entry. Please try again.');
	        });
	    }
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
	    // Prompt user for investment name to delete
	    const investmentName = prompt('Enter the name of the investment to delete:');
	    if (!investmentName) return; // Exit if user cancels or inputs empty string

	    // Confirm deletion with user
	    const confirmMessage = `Are you sure you want to delete the investment "${investmentName}"?`;
	    if (confirm(confirmMessage)) {
	        // Send request to server to delete investment
	        fetch(`/delete_investment?investmentName=${investmentName}`, {
	            method: 'DELETE'
	        })
	        .then(response => {
	            if (response.ok) {
	                alert('Investment deleted successfully.');
	            } else {
	                throw new Error('Failed to delete investment.');
	            }
	        })
	        .catch(error => {
	            console.error('Error deleting investment:', error);
	            alert('Failed to delete investment. Please try again.');
	        });
	    }
	});

    // Add event listeners for visualization options
    // document.getElementById('projections').addEventListener('click', function() {
    //     // Open a form in a window for projections
    //     window.open('/projections_form', '_blank');
    // });

    // document.getElementById('pie_charts').addEventListener('click', function() {
    //     // Open a form in a window for pie charts
    //     window.open('/pie_charts_form', '_blank');
    // });

    // document.getElementById('re_calculator').addEventListener('click', function() {
    //     // Open a form in a window for retirement goal calculator
    //     window.open('/re_calculator_form', '_blank');
    // });

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
