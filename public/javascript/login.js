// Function to handle user signup
async function signupFormHandler(event) {
  event.preventDefault();

  // Retrieve the username and password from the form
  const username = document.querySelector('#username-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && password) {
    try {
      // Send a POST request to create a new user
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      // If the response is OK, alert the user and reload the page
      if (response.ok) {
        alert('New user created. You can now log in.');
        document.location.reload();
      } else {
        // If the response is not OK, throw an error
        throw new Error(`Failed to sign up: ${response.statusText}`);
      }
    } catch (error) {
      // Alert the user of any errors
      alert(error.message);
    }
  }
}

// Function to handle user login
async function loginFormHandler(event) {
  event.preventDefault();

  // Retrieve the username and password from the form
  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (username && password) {
    try {
      // Send a POST request for user login
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      // If the response is OK, redirect to the dashboard
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        // If the response is not OK, throw an error
        throw new Error(`Failed to log in: ${response.statusText}`);
      }
    } catch (error) {
      // Alert the user of any errors
      alert(error.message);
    }
  }
}

// Attach event listeners to the respective forms
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
