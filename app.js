// 1. Connect to Supabase
const SUPABASE_URL = 'https://mdtdbmozjtilnkgvdabx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdGRibW96anRpbG5rZ3ZkYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTgzMTQsImV4cCI6MjA2OTY5NDMxNH0.x22c8GVx4xQr9Sn-RfmH4iGzJ8dpAAY2J4izCFJBm5w';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Get HTML Elements
const reviewForm = document.getElementById('review-form');
const submitBtn = document.getElementById('submit-btn');

// 3. Add Event Listener for form submission
reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page

    // Disable button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Get form data
    const reviewerName = document.getElementById('reviewer-name').value;
    const movieTitle = document.getElementById('movie-title').value;
    const rating = document.getElementById('rating').value;
    const reviewNote = document.getElementById('review-note').value;

    // 4. Send data to Supabase
    const { data, error } = await supabase
        .from('reviews')
        .insert([
            { 
                reviewer_name: reviewerName, 
                movie_title: movieTitle, 
                rating: rating,
                review_note: reviewNote 
            }
        ]);

    if (error) {
        console.error('Error inserting review:', error);
        alert('Sorry, there was an error submitting your review. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
    } else {
        console.log('Successfully submitted review:', data);
        alert('Thank you! Your review has been submitted.');
        
        // Redirect to the timeline page after successful submission
        window.location.href = 'timeline.html';
    }
});
