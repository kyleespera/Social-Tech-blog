// This function handles the editing of a post
async function editFormHandler(event) {
  event.preventDefault(); // Prevent the default form submit action

  // Extract the new title and post text from the form
  const title = document.querySelector('input[name="post-title"]').value.trim();
  const post_text = document.querySelector('textarea[name="post-text"]').value.trim();

  // Obtain the post ID from the URL
  const urlSegments = window.location.toString().split('/');
  const id = urlSegments[urlSegments.length - 1];

  try {
    // Send a PUT request to the server to update the post
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        post_text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Redirect to the dashboard if the update was successful
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      // If the response is not ok, throw an error with the response status
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    // Alert the user in case of an error
    alert(error.message);
  }
}

// Attach the event listener to the edit post form submit event
document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
