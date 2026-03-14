import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaNF_D-DiSxpDqnQVAZJffVJpit3uOAHs",
  authDomain: "glams-hotel-consignes.firebaseapp.com",
  projectId: "glams-hotel-consignes",
  storageBucket: "glams-hotel-consignes.appspot.com",
  messagingSenderId: "231305056674",
  appId: "1:231305056674:web:061f86037b591f1cf6e2fb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fonction de connexion
window.login = async function() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    alert("Connexion réussie");
    localStorage.setItem("userEmail", email);

    // redirection vers la page du cahier
    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);

  }

};


// Vérifie si utilisateur connecté
onAuthStateChanged(auth, (user) => {

  if (user) {

    console.log("Utilisateur connecté :", user.email);

  } else {

    window.location.href = "index.html";

  }

});
