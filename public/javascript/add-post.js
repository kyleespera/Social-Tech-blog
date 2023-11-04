// This function handles the submission of a new post
async function newFormHandler(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Get the post title and text from the form fields
  const title = document.querySelector('input[name="post-title"]').value.trim();
  const post_text = document.querySelector('textarea[name="post-text"]').value.trim();

  // Check if title and post_text are not empty
  if (!title || !post_text) {
    alert('Please fill in all the fields.');
    return; // Exit the function if fields are empty
  }

  try {
    // Send a POST request to the server with the post data
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Redirect to the dashboard if the post was created successfully
    if (response.ok) {
      document.location.replace('/dashboard');
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
document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
