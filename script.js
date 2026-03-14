import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

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

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("userEmail", email);
    alert("Connexion réussie");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};

window.logout = async function () {
  try {
    await signOut(auth);
    localStorage.removeItem("userEmail");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  const isLoginPage = !!document.getElementById("email");

  if (user) {
    localStorage.setItem("userEmail", user.email);

    const userZone = document.getElementById("user");
    if (userZone) {
      userZone.innerText = "Connecté : " + user.email;
    }

    if (isLoginPage) {
      window.location.href = "dashboard.html";
    }
  } else {
    localStorage.removeItem("userEmail");

    if (!isLoginPage) {
      window.location.href = "index.html";
    }
  }
});
