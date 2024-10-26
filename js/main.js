import { properties } from './properties.js';

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const notes = document.querySelectorAll('.note');

    // Function to gather all existing values from the notes
    function getExistingValues(key) {
        const values = new Set();
        notes.forEach(note => {
            const value = note.getAttribute(`data-${key}`);
            if (value) {
                if (value.includes(',')) {
                    value.split(',').forEach(val => values.add(val.trim()));
                } else {
                    values.add(value);
                }
            }
        });
        return Array.from(values);
    }

    // Render filter options based on existing values in the notes
    properties.forEach(property => {
        const existingValues = getExistingValues(property.key);
        if (existingValues.length > 0) {
          console.log('Rendering started...');
            const filterGroup = document.createElement('div');
            filterGroup.classList.add('filter-group');
            filterGroup.innerHTML = `<h3>${property.title}</h3>`;

            property.values.forEach(option => {
                if (existingValues.includes(option.value)) {
                    const label = document.createElement('label');
                    label.innerHTML = `
                        <input type="${property.type === 'single' ? 'radio' : 'checkbox'}"
                               name="${property.key}"
                               value="${option.value}">
                        ${option.label}
                    `;
                    filterGroup.appendChild(label);
                }
            });

            sidebar.appendChild(filterGroup);
        }
    });

    // Filter function to show/hide notes
    function filterNotes() {
        notes.forEach(note => {
            let isVisible = true;

            properties.forEach(property => {
                const selectedOptions = Array.from(
                    document.querySelectorAll(`input[name="${property.key}"]:checked`)
                ).map(input => input.value);

                if (selectedOptions.length > 0) {
                    const noteValue = note.getAttribute(`data-${property.key}`);
                    const noteValues = noteValue ? noteValue.split(',').map(val => val.trim()) : [];

                    if (property.type === 'single') {
                        if (!selectedOptions.includes(noteValue)) {
                            isVisible = false;
                        }
                    } else if (property.type === 'multiple') {
                        if (!selectedOptions.some(option => noteValues.includes(option))) {
                            isVisible = false;
                        }
                    }
                }
            });

            note.classList.toggle('hidden', !isVisible);
        });
    }

    // Add event listeners for each filter input
    sidebar.addEventListener('change', filterNotes);
});
