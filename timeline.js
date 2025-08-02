// 1. Connect to Supabase
const SUPABASE_URL = 'https://mdtdbmozjtilnkgvdabx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdGRibW96anRpbG5rZ3ZkYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTgzMTQsImV4cCI6MjA2OTY5NDMxNH0.x22c8GVx4xQr9Sn-RfmH4iGzJ8dpAAY2J4izCFJBm5w';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Get HTML Elements
const timelineContainer = document.getElementById('timeline-container');
const ratingFilter = document.getElementById('rating-filter');

// 3. Function to fetch and display reviews
const fetchAndDisplayReviews = async (filterRating = 'all') => {
    // Show loading message
    timelineContainer.innerHTML = '<p class="loading-text">Loading reviews...</p>';

    let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false }); // Show newest first

    // Add filter if a specific rating is selected
    if (filterRating !== 'all') {
        query = query.eq('rating', filterRating);
    }

    const { data: reviews, error } = await query;

    if (error) {
        console.error('Error fetching reviews:', error);
        timelineContainer.innerHTML = '<p>Could not fetch reviews.</p>';
        return;
    }

    if (reviews.length === 0) {
        timelineContainer.innerHTML = '<p>No reviews found. Be the first to add one!</p>';
        return;
    }

    // Clear loading message
    timelineContainer.innerHTML = '';

    // Create and append a card for each review
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');
        reviewCard.dataset.id = review.id; // Store ID for deletion

        const formattedDate = new Date(review.created_at).toLocaleDateString();
        const stars = '⭐'.repeat(review.rating);

        reviewCard.innerHTML = `
            <h3>${review.movie_title}</h3>
            <div class="review-info">Reviewed by <strong>${review.reviewer_name}</strong> on ${formattedDate}</div>
            <div class="review-rating">${stars}</div>
            ${review.review_note ? `<p class="review-note">"${review.review_note}"</p>` : ''}
            <button class="delete-btn" title="Delete Review">X</button>
        `;

        timelineContainer.appendChild(reviewCard);
    });
};

// 4. Function to delete a review
const deleteReview = async (reviewId) => {
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

    if (error) {
        console.error('Error deleting review:', error);
        alert('Could not delete the review.');
    } else {
        console.log(`Successfully deleted review ${reviewId}`);
        // Remove the card from the page for instant feedback
        document.querySelector(`.review-card[data-id="${reviewId}"]`).remove();
    }
};

// 5. Add Event Listeners
// Fetch reviews when the page loads
document.addEventListener('DOMContentLoaded', () => fetchAndDisplayReviews());

// Re-fetch reviews when the filter changes
ratingFilter.addEventListener('change', () => {
    fetchAndDisplayReviews(ratingFilter.value);
});

// Listen for clicks on delete buttons
timelineContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const card = event.target.closest('.review-card');
        const reviewId = card.dataset.id;
        if (confirm('Are you sure you want to delete this review?')) {
            deleteReview(reviewId);
        }
    }
});
