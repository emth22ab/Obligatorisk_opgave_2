import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Funktion der observerer ændringer i brugerens login-status
function onAuthStateChange(callback) {
    const auth = getAuth();  // Henter Firebase auth instans
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            // Brugeren er logget ind, vi sender brugerdata tilbage via callback
            const uid = user.uid;
            callback({ loggedIn: true, user: user });
            console.log("You are logged in!");
        } else {
            // Brugeren er logget ud, vi opdaterer state via callback
            callback({ loggedIn: false });
            console.log("You are logged out!");
        }
    });
}

export default onAuthStateChange;
