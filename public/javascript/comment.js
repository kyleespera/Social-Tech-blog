// This function handles the submission of a new comment
async function commentFormHandler(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the comment text from the form field
  const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

  // Extract the post ID from the URL
  const urlSegments = window.location.toString().split('/');
  const post_id = urlSegments[urlSegments.length - 1];

  if (!comment_text) {
    alert('Comment cannot be empty.');
    return; // Exit the function if the comment is empty
  }

  try {
    // Send a POST request to the server with the comment data
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        post_id,
        comment_text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Reload the page if the comment was posted successfully
    if (response.ok) {
      document.location.reload();
    } else {
      // If the response is not ok, throw an error with the response status
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    // Alert the user in case of an error
    alert(error.message);
  }
}

// Attach the event listener to the form submission
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
