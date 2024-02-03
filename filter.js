document.addEventListener('DOMContentLoaded', function () {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('.filter-checkbox');

    // Add event listener to each checkbox
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function (event) {
            applyFilters();
            event.preventDefault();
            return false;
        });
    });

    async function fetchReviews(placeName) {
        try {
            const response = await fetch(`http://localhost:3000/reviews?place=${placeName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const reviews = await response.json();
            return reviews;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Save a review to your backend
    async function saveReview(placeName, rating, comment) {
        try {
            const response = await fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    place: placeName,
                    rating: rating,
                    comment: comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            console.log('Review submitted successfully');
        } catch (error) {
            console.error(error);
        }
    }
    
    // Add event listener to the search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', applyFilters);

    // Initial display of all places
    applyFilters();

    // Get all buttons in the navigation
    const navButtons = document.querySelectorAll('nav a');

    // Add click event listener to each button
    navButtons.forEach(function (button) {
        button.addEventListener('click', handleButtonClick);
    });

    // Add click event listener to each "Learn More" button
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    learnMoreButtons.forEach(function (button) {
        button.addEventListener('click', handleLearnMoreClick);
    });

    // Add click event listener to the "Reviews" link
    const reviewsLink = document.querySelector('nav a[href="reviews.html"]');
    reviewsLink.addEventListener('click', function (event) {
        event.preventDefault();

        // Fetch the place name dynamically or use a default value
        const placeName = 'Starbucks';

        // Render reviews for the selected place
        renderReviews(placeName);
    });

    // Display average ratings and reviews when the page is loaded
    displayAverageRatings();
    renderReviews();

    // Additional code for integrating the review changes
    const reviewForm = document.getElementById('reviewForm');
    const placeSelect = document.getElementById('placeSelect');

    // Add event listener to the form
    reviewForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedPlace = placeSelect.value;
        submitReview(selectedPlace);
    });
});

function applyFilters() {
    // Get selected values from checkboxes
    const selectedMeals = getSelectedValues('meal');
    const selectedCuisines = getSelectedValues('cuisine');
    const selectedDietaryRestrictions = getSelectedValues('restrictions');

    // Get all place boxes
    const placeBoxes = document.querySelectorAll('.place-box');

    // Get the search input value
    const searchQuery = searchInput.value.toLowerCase();

    // Iterate over place boxes to show/hide based on filters and search query
    placeBoxes.forEach(function (placeBox) {
        const placeMeal = placeBox.getAttribute('data-meal');
        const placeCuisine = placeBox.getAttribute('data-cuisine').split(' ');
        const placeDietaryRestrictions = placeBox.getAttribute('data-restrictions').split(' ');

        const isMealMatch = selectedMeals.length === 0 || selectedMeals.some(meal => placeMeal.includes(meal));
        const isCuisineMatch = selectedCuisines.length === 0 || selectedCuisines.every(cuisine => placeCuisine.includes(cuisine));
        const isDietaryRestrictionsMatch = selectedDietaryRestrictions.length === 0 || selectedDietaryRestrictions.every(dr => placeDietaryRestrictions.includes(dr));

        // Add search functionality
        const placeName = placeBox.querySelector('h3').innerText.toLowerCase();
        const isSearchMatch = placeName.includes(searchQuery);

        // Show/hide place box based on filters and search query
        placeBox.style.display = isMealMatch && isCuisineMatch && isDietaryRestrictionsMatch && isSearchMatch ? 'block' : 'none';
    });
}

function getSelectedValues(category) {
    const checkboxes = document.querySelectorAll(`[name="${category}"]:checked`);
    return Array.from(checkboxes).map(function (checkbox) {
        return checkbox.value;
    });
}

function handleButtonClick() {
    // Remove 'active' class from all buttons
    document.querySelectorAll('nav a').forEach(function (button) {
        button.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    this.classList.add('active');
}

function handleLearnMoreClick(event) {
    // Open the link in a new tab
    window.open(event.target.href, '_blank');
}

function displayAverageRatings() {
    // Loop through each place and display the average rating
    document.querySelectorAll('.place-box').forEach(function (placeBox) {
        const placeName = placeBox.querySelector('h3').innerText;
        const averageRating = calculateAverageRating(placeName);
        const ratingElement = document.getElementById(`${placeName}-rating`);
        if (ratingElement) {
            ratingElement.innerText = averageRating.toFixed(1);
        }
    });
}

function calculateAverageRating(placeName) {
    const reviews = getReviewsForPlace(placeName);
    if (reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
}

function renderReviews(selectedPlace) {
    const reviewContainer = document.querySelector('.review-container');

    // Fetch reviews for the selected place from storage or a server
    const reviews = getReviewsForPlace(selectedPlace);

    // Clear the existing reviews
    reviewContainer.innerHTML = '';

    // Loop through each review and display it
    reviews.forEach(function (review) {
        const reviewElement = document.createElement('div');
        reviewElement.innerHTML = `
            <p>Place: ${selectedPlace}</p>
            <p>Rating: ${review.rating}</p>
            <p>Comment: ${review.comment}</p>
        `;
        reviewContainer.appendChild(reviewElement);
    });
}

// Replace the getReviewsForPlace function
async function getReviewsForPlace(placeName) {
    try {
        // Assuming you have an API endpoint to fetch reviews based on placeName
        const response = await fetch(`https://your-api-endpoint/reviews?place=${placeName}`);
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

function submitReview(placeName) {
    const ratingInput = document.getElementById(`${placeName}-rating`);
    const commentInput = document.getElementById(`${placeName}-comment`);

    if (ratingInput.checkValidity()) {
        const rating = parseInt(ratingInput.value, 10);
        const comment = commentInput.value;

        // You can save the review to storage or a server here
        saveReview(placeName, rating, comment);

        // Clear the form inputs
        ratingInput.value = '';
        commentInput.value = '';

        // Re-render the reviews on the page for the specific place
        renderReviews(placeName);
    } else {
        alert('Please enter a valid rating (1-5).');
    }
}

// Save a review to local storage
function saveReview(placeName, rating, comment) {
    // Retrieve existing reviews from local storage
    const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];

    // Add the new review
    existingReviews.push({ place: placeName, rating: rating, comment: comment });

    // Save the updated reviews back to local storage
    localStorage.setItem('reviews', JSON.stringify(existingReviews));
}

// Fetch reviews from local storage
function getStoredReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || [];
}