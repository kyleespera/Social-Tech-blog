// This function handles the deletion of a post
async function deleteFormHandler(event) {
  event.preventDefault(); // Prevent the default action

  // Extract the post ID from the URL
  const urlSegments = window.location.toString().split('/');
  const id = urlSegments[urlSegments.length - 1];

  try {
    // Send a DELETE request to the server
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    });

    // Redirect to the dashboard if the deletion was successful
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

// Attach the event listener to the delete button click event
document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);
