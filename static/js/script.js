// Function to format the rating into stars
function formatRating(rating) {
    const ratingValue = parseFloat(rating);
    const fullStars = Math.floor(ratingValue); // Full stars (1-5)
    const halfStar = ratingValue - fullStars >= 0.5 ? 1 : 0; // Half star check
    const emptyStars = 5 - fullStars - halfStar; // Empty stars

    let stars = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">&#9733;</span>'; // Full star
    }

    // Add half star
    if (halfStar) {
        stars += '<span class="star">&#9733;</span>'; // Half star
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star">&#9734;</span>'; // Empty star
    }

    return stars;
}

// Function to check if an image exists
function imageExists(imageUrl, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = imageUrl;
}


// Function to fetch recommendations
async function getRecommendations() {
    const movieName = document.getElementById('movie-name').value;
    const numRecommendations = document.getElementById('num-recommendations').value;

    // Prepare form data
    const formData = new FormData();
    formData.append('movie_name', movieName);
    formData.append('num_recommendations', numRecommendations);

    const container = document.getElementById('recommendations-container');
    container.innerHTML = ""; // Clear previous recommendations or default content

    try {
        const response = await fetch('http://127.0.0.1:5000/recommend', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const recommendations = await response.json();

        // Check if recommendations are available
        if (recommendations.length === 0) {
            container.innerHTML = "<p>No recommendations found. Try another movie.</p>";
            return;
        }

        // Display each movie recommendation
        recommendations.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('recommendation');

            // Path to the image
            const imageUrl = `static/images/${movie["IMDB ID"]}.jpg`;

            // Check if the image exists
            imageExists(imageUrl, (exists) => {
                if (exists) {
                    // Image element for the movie
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = `${movie["Movie Title"]} Image`;
                    img.classList.add('movie-image');
                    movieDiv.prepend(img);
                } else {
                    // Fallback message when the image is not available
                    const noImageDiv = document.createElement('div');
                    noImageDiv.classList.add('no-image');
                    noImageDiv.textContent = "Sorry, image not available";
                    movieDiv.prepend(noImageDiv);
                }
            });

            movieDiv.innerHTML += `
                <div class="movie-title" onclick="toggleDetails(this)">${movie["Movie Title"]}</div>
                <div class="movie-details hidden">
                    <div class="movie-detail"><span>IMDB ID:</span> ${movie["IMDB ID"]}</div>
                    <div class="movie-detail"><span>Rating:</span> <div class="star-rating">${formatRating(movie["Rating"])}</div></div>
                    <div class="movie-detail"><span>Genre:</span> ${movie["Genre"]}</div>
                    <div class="movie-detail">
                        <span>Cast:</span>
                        <div class="cast-list">
                            <ul>
                                ${movie["Cast"].split(",").map(actor => `<li>${actor.trim()}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="movie-detail"><span>Duration:</span> ${movie["Duration"]}</div>
                    <div class="movie-detail"><span>Crew:</span> ${movie["Crew"]}</div>
                </div>
            `;

            container.appendChild(movieDiv);
        });
    } catch (error) {
        // Handle errors
        const container = document.getElementById('recommendations-container');
        container.innerHTML = `<p>Something went wrong: ${error.message}</p>`;
    }
}


// Function to show the modal with movie details
function showModal(detailsHTML) {
    const modal = document.getElementById('movie-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModal = document.querySelector('.close');

    console.log('Movie Details to show:', detailsHTML);  // Debugging

    // Inject the movie details into the modal
    modalDetails.innerHTML = detailsHTML;

    // Show the modal
    modal.classList.remove('hidden');

    // Close the modal when the close button is clicked
    closeModal.onclick = () => {
        modal.classList.add('hidden');
    };

    // Close the modal when clicking outside the modal content
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    };
}


// Function to toggle movie details in the modal
function toggleDetails(element) {
    // Find the movie details within the same parent element
    const details = element.parentElement.querySelector('.movie-details');
    const detailsHTML = details.innerHTML;

    // Show the modal with the movie details
    showModal(detailsHTML);
}


// Load movie titles on page load
async function loadMovieTitles() {
    try {
        const response = await fetch('/get_movie_titles');
        const movieTitles = await response.json();

        const movieNameSelect = document.getElementById('movie-name');
        movieNameSelect.innerHTML = ''; // Clear existing options

        // Add a default placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.text = "Select a Movie";
        movieNameSelect.appendChild(placeholderOption);

        movieTitles.forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.innerText = title;
            movieNameSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading movie titles:", error);
    }
}

// Load movie titles when the page loads
window.onload = loadMovieTitles;
