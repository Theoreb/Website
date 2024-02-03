document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form') as HTMLFormElement;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        // Implement your login logic here
        if (username === 'your_username' && password === 'your_password') {
            alert('Login successful!');
            // Redirect to another page or perform necessary actions here
        } else {
            alert('Login failed. Please check your credentials.');
        }
    });
});
