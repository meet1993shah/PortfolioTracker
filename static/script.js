document.addEventListener('DOMContentLoaded', function() {
	// Function to create a new note
	function createNoteOnWhiteboard(content, quadrant, color, noteId) {
		const note = document.createElement('div');
		note.classList.add('note');
		note.style.backgroundColor = color;
		note.setAttribute('draggable', true);
		note.setAttribute('data-note-id', noteId); // Use a data attribute for the note's ID

		// Create a span for the note content (to make it non-editable by default)
		const noteContent = document.createElement('span');
		noteContent.classList.add('note-content');
		noteContent.textContent = content;
		note.appendChild(noteContent);

		// Create an edit icon
		const editIcon = document.createElement('span');
		editIcon.innerHTML = '&#9998;'; // Using the Unicode character for a pencil
		editIcon.classList.add('edit-icon');
		note.appendChild(editIcon);

		// Make the note content editable when the edit icon is clicked
		editIcon.addEventListener('click', function() {
			noteContent.setAttribute('contenteditable', 'true');
			noteContent.focus(); // Focus on the content to start editing immediately
		});

		// Handle the end of editing
		noteContent.addEventListener('blur', function() {
			updateNoteContent(noteId, noteContent.textContent);
			noteContent.removeAttribute('contenteditable'); // Make it non-editable again
		});

		// Create a delete icon
		const deleteIcon = document.createElement('span');
		deleteIcon.innerHTML = '&#128465;'; // trashcan icon
		deleteIcon.classList.add('delete-icon');
		note.appendChild(deleteIcon);

		// Handle the delete action when the delete icon is clicked
		deleteIcon.addEventListener('click', function() {
			deleteNoteFromServer(noteId);
			note.remove(); // Remove the note element from the DOM
		});
		
		// Add dragstart event listener
		note.addEventListener('dragstart', function(e) {
			e.dataTransfer.setData('text/plain', note.getAttribute('data-note-id'));
		});

		// Append note to the specified quadrant
		document.getElementById(quadrant).appendChild(note);
	}

	document.getElementById('noteForm').addEventListener('submit', function(e) {
		e.preventDefault();
		const content = document.getElementById('noteContent').value;
		const quadrant = document.getElementById('noteQuadrant').value;
		const color = document.getElementById('noteColor').value;

		fetch('/notes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content, quadrant, color }),
		})
		.then(response => response.json())
		.then(data => {
			if(data.success) {
				// Add the note to the quadrant
				createNoteOnWhiteboard(content, quadrant, color, data.noteId);
				// Reset form
				document.getElementById('noteForm').reset();
			} else {
				console.error('failed to create note');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	});

	document.querySelectorAll('.quadrant').forEach(quadrant => {
		// Allow the quadrant to be a drop target
		quadrant.addEventListener('dragover', function(e) {
			e.preventDefault(); // Necessary to allow dropping
		});

		quadrant.addEventListener('drop', function(e) {
			e.preventDefault();
			const noteId = e.dataTransfer.getData('text/plain');
			const note = document.querySelector(`[data-note-id="${noteId}"]`);
			quadrant.appendChild(note);

			// Update the note's quadrant in the database
			updateNoteQuadrantInDB(noteId, quadrant.id);
		});
	});

	// Function to update the note's quadrant after drag and drop
	function updateNoteQuadrantInDB(noteId, newQuadrant) {
		fetch(`/notes/${noteId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ quadrant: newQuadrant }),
		})
		.then(response => response.json())
		.then(data => {
			if(!data.success) {
				console.error('Failed to update note quadrant');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	// Function to update note content after editing
	function updateNoteContent(noteId, newContent) {
		// Send the updated contnet to the server
		fetch(`/notes/${noteId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content: newContent }),
		})
		.then(response => response.json())
		.then(data => {
			if(!data.success) {
				console.error("Failed to update note's cotent");
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	// Function to delete the note from the server
	function deleteNoteFromServer(noteId) {
		fetch(`/notes/${noteId}`, {
			method: 'DELETE'
		})
		.then(response => response.json())
		.then(data => {
			if(!data.success) {
				console.error('Failed to delete note');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	// Function to fetch and display notes from the server
	function fetchAndDisplayNotes() {
		fetch(`/notes`, {
			method: 'GET'
		})
		.then(response => response.json())
		.then(data => {
			if(data.success) {
				data.notes.forEach(note => {
					createNoteOnWhiteboard(note.content, note.quadrant, note.color, note.id);
				});
			} else {
				console.error('failed to fetch notes');
			}
		})
		.catch(error => {
			console.error('Error fetching notes:', error);
		});
	}

	// Call the function to fetch and display notes on page load
	fetchAndDisplayNotes();

	const searchInput = document.getElementById('search-input');

	searchInput.addEventListener('input', function() {
		const query = searchInput.value.toLowerCase();
		const notes = document.querySelectorAll('.note');
		notes.forEach(note => {
			// Assuming the note's content is the textContent of the note element
			const noteContentElement = note.querySelector('span');
			const noteContent = noteContentElement.textContent.toLowerCase();
			if ((noteContent.includes(query)) && (query.length > 0)) {
				note.classList.add('highlighted');
			} else {
				note.classList.remove('highlighted');
			}
		});
		
	});
});
