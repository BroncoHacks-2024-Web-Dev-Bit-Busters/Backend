document.addEventListener('DOMContentLoaded', function () {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('.filter-checkbox');

    // Add event listener to each checkbox
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', applyFilters);
    });

    // Initial display of all places
    applyFilters();
});

function applyFilters() {
    // Get selected values from checkboxes
    const selectedMeals = getSelectedValues('meal');
    const selectedCuisines = getSelectedValues('cuisine');

    // Get all place boxes
    const placeBoxes = document.querySelectorAll('.place-box');

    // Iterate over place boxes to show/hide based on filters
    placeBoxes.forEach(function (placeBox) {
        const placeMeal = placeBox.getAttribute('data-meal');
        const placeCuisine = placeBox.getAttribute('data-cuisine');

        const isMealMatch = selectedMeals.length === 0 || selectedMeals.some(meal => placeMeal.includes(meal));
        const isCuisineMatch = selectedCuisines.length === 0 || selectedCuisines.includes(placeCuisine);

        // Show/hide place box based on filters
        placeBox.style.display = isMealMatch && isCuisineMatch ? 'block' : 'none';
    });
}

function getSelectedValues(category) {
    const checkboxes = document.querySelectorAll(`[name="${category}"]:checked`);
    return Array.from(checkboxes).map(function (checkbox) {
        return checkbox.value;
    });
}