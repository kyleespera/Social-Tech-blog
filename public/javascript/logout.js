async function logout() {
  try {
    // Send a POST request to log the user out
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    // If the response is OK, redirect to the home page
    if (response.ok) {
      document.location.replace('/');
    } else {
      // If the response is not OK, throw an error
      throw new Error(`Failed to log out: ${response.statusText}`);
    }
  } catch (error) {
    // Alert the user of any errors
    alert(error.message);
  }
}

// Attach the event listener to the logout button
document.querySelector('#logout').addEventListener('click', logout);
