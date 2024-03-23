document.addEventListener('DOMContentLoaded', function() {
	// Function to create a new entry
	function createEntryOnDashboard(entryId, entryContent) {
		const entry = document.createElement('div');
		entry.classList.add('entry');
		// Use a data attribute for the entry's ID
		entry.setAttribute('data-entry-id', entryId);

		// Create a span for the entry content (to make it non-editable by default)
		const entryContent = document.createElement('span');
		entryContent.classList.add('entry-content');
		entryContent.textContent = entryContent;
		entry.appendChild(entryContent);

		// Create an edit icon
		const editIcon = document.createElement('span');
		// Using the Unicode character for a pencil
		editIcon.innerHTML = '&#9998;';
		editIcon.classList.add('edit-icon');
		entry.appendChild(editIcon);

		// Make the entry content editable when the edit icon is clicked
		editIcon.addEventListener('click', function() {
			entryContent.setAttribute('contenteditable', 'true');
			// Focus on the content to start editing immediately
			entryContent.focus();
		});

		// Handle the end of editing
		noteContent.addEventListener('blur', function() {
			updateEntryContent(entryInfo.id, entryContent.textContent);
			// Make it non-editable again
			entryContent.removeAttribute('contenteditable');
		});

		// Create a delete icon
		const deleteIcon = document.createElement('span');
		// Using the Unicode character for a trashcan
		deleteIcon.innerHTML = '&#128465;';
		deleteIcon.classList.add('delete-icon');
		entry.appendChild(deleteIcon);

		// Handle the delete action when the delete icon is clicked
		deleteIcon.addEventListener('click', function() {
			deleteNoteFromServer(noteId);
			// Remove the entry element from the DOM
			entry.remove();
		});
	}

	document.getElementById('entryForm').addEventListener('submit', function(e) {
		e.preventDefault();
		const content = document.getElementById('entryContent').value;

		fetch('/entries', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content }),
		})
		.then(response => response.json())
		.then(data => {
			if(data.success) {
				// Add the entry to the dashboard
				createEntryOnDashboard(content, data.entryId);
				// Reset form
				document.getElementById('entryForm').reset();
			} else {
				console.error('failed to create entry');
			}
		})
		.catch((error) => {
			console.error('Error adding entry:', error);
		});
	});

	// Function to update entry content after editing
	function updateEntryContent(entryId, newContent) {
		// Send the updated contnet to the server
		fetch(`/entries/${entryId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content: newContent }),
		})
		.then(response => response.json())
		.then(data => {
			if(!data.success) {
				console.error("Failed to update entry's cotent");
			}
		})
		.catch((error) => {
			console.error('Error updating entry:', error);
		});
	}

	// Function to delete the entry from the server
	function deleteEntryFromServer(entryId) {
		fetch(`/entries/${entryId}`, {
			method: 'DELETE'
		})
		.then(response => response.json())
		.then(data => {
			if(!data.success) {
				console.error('Failed to delete entry');
			}
		})
		.catch((error) => {
			console.error('Error deleting entry:', error);
		});
	}

	// Function to fetch and display entries from the server
	function fetchAndDisplayEntries() {
		fetch(`/entries`, {
			method: 'GET'
		})
		.then(response => response.json())
		.then(data => {
			if(data.success) {
				data.entries.forEach(entry => {
					createEntryOnDashboard(entry.id, entry.content);
				});
			} else {
				console.error('failed to fetch entries');
			}
		})
		.catch(error => {
			console.error('Error fetching entries:', error);
		});
	}

	// Call the function to fetch and display notes on page load
	fetchAndDisplayEntries();
});
