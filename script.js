import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword
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

window.login = async function() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("userEmail", email);
    alert("Connexion réussie");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};

window.logout = async function() {
  try {
    await signOut(auth);
    localStorage.removeItem("userEmail");
    alert("Déconnexion réussie");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

window.changePassword = async function() {
  const user = auth.currentUser;
  const newPassword = document.getElementById("newPassword")?.value.trim();

  if (!newPassword) {
    alert("Entre un nouveau mot de passe");
    return;
  }

  if (!user) {
    alert("Aucun utilisateur connecté");
    return;
  }

  try {
    await updatePassword(user, newPassword);
    alert("Mot de passe modifié avec succès");
    document.getElementById("newPassword").value = "";
  } catch (error) {
    alert(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  const isLoginPage = !!document.getElementById("email");
  const isDashboardPage = !!document.getElementById("notes");
  const isSettingsPage = !!document.getElementById("newPassword");

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

    if (isDashboardPage || isSettingsPage) {
      window.location.href = "index.html";
    }
  }
});
