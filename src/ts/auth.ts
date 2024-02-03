import firebase from 'firebase/app';
import 'firebase/auth';

// Configuration Firebase (vous pouvez trouver ces informations dans la console Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyDxew1oJvqE0wcxjwp0OdXh3QoCnqFn7FY",
    authDomain: "website-38571.firebaseapp.com",
    databaseURL: "https://website-38571-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "website-38571",
    storageBucket: "website-38571.appspot.com",
    messagingSenderId: "770828667083",
    appId: "1:770828667083:web:de60c85d9266aedffcb34e"
  
  };
  

// Initialisez Firebase avec la configuration
firebase.initializeApp(firebaseConfig);

// Obtenir une référence à l'objet d'authentification Firebase
const auth = firebase.auth();

// Fonction pour s'authentifier avec un e-mail et un mot de passe
export const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        throw error;
    }
};

// Fonction pour se déconnecter
export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        throw error;
    }
};

// Fonction pour observer les changements d'état d'authentification
export const onAuthStateChanged = (callback: (user: firebase.User | null) => void) => {
    auth.onAuthStateChanged(callback);
};
