import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from './auth';

// Exemple de connexion avec un e-mail et un mot de passe
signInWithEmailAndPassword('user@example.com', 'password')
    .then(user => {
        console.log('Connecté en tant que', user.displayName);
    })
    .catch(error => {
        console.error('Erreur de connexion:', error.message);
    });

// Exemple de déconnexion
signOut()
    .then(() => {
        console.log('Déconnecté');
    })
    .catch(error => {
        console.error('Erreur de déconnexion:', error.message);
    });

// Exemple d'observation des changements d'état d'authentification
onAuthStateChanged(user => {
    if (user) {
        console.log("L'utilisateur est connecté en tant que", user.displayName);
    } else {
        console.log("L'utilisateur est déconnecté");
    }
});
