import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDxew1oJvqE0wcxjwp0OdXh3QoCnqFn7FY",
  authDomain: "website-38571.firebaseapp.com",
  databaseURL: "https://website-38571-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "website-38571",
  storageBucket: "website-38571.appspot.com",
  messagingSenderId: "770828667083",
  appId: "1:770828667083:web:de60c85d9266aedffcb34e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function authenticate(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Authentication error:", errorMessage);
    });
}

// Call the function to connect and authenticate
authenticate("user@example.com", "password");