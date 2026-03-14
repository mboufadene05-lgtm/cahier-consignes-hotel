function connecter() {
  const nom = document.getElementById("loginNom").value;

  if (!nom) {
    alert("Choisissez un réceptionniste");
    return;
  }

  localStorage.setItem("receptionniste", nom);
  document.getElementById("userName").textContent = nom;

  const champNom = document.getElementById("nom");
  if (champNom) champNom.value = nom;
}

function deconnecter() {
  localStorage.removeItem("receptionniste");
  document.getElementById("userName").textContent = "Non défini";
}

function recupererToutesLesConsignes() {
  const shifts = ["matin", "soir", "nuit"];
  let toutes = [];

  shifts.forEach(function(shift) {
    const consignes = JSON.parse(localStorage.getItem(shift)) || [];
    consignes.forEach(function(c) {
      toutes.push(c);
    });
  });

  return toutes;
}

function ajouterConsigne() {
  const shift = document.getElementById("shift").value;

  const nomInput = document.getElementById("nom");
  const chambreInput = document.getElementById("chambre");
  const messageInput = document.getElementById("message");
  const statutInput = document.getElementById("statutChambre");

  let nom = nomInput.value.trim();
  const chambre = chambreInput.value.trim();
  const message = messageInput.value.trim();
  const statut = statutInput.value;

  const receptionniste = localStorage.getItem("receptionniste");

  if (!nom && receptionniste) {
    nom = receptionniste;
  }

  if (!nom || !chambre || !message) {
    alert("Remplissez tous les champs");
    return;
  }

  const maintenant = new Date();

  const consigne = {
    nom: nom,
    chambre: chambre,
    message: message,
    statut: statut,
    shift: shift,
    date: maintenant.toLocaleString("fr-FR"),
    jour: maintenant.toLocaleDateString("fr-FR")
  };

  const consignes = JSON.parse(localStorage.getItem(shift)) || [];
  consignes.push(consigne);

  localStorage.setItem(shift, JSON.stringify(consignes));

  nomInput.value = receptionniste || "";
  chambreInput.value = "";
  messageInput.value = "";
  statutInput.value = "ok";

  afficherConsignes();
  afficherHistorique();
  afficherChambres();
  afficherDashboard();
}

function afficherConsignes() {

  const config = [
    { cle: "matin", idListe: "listeMatin" },
    { cle: "soir", idListe: "listeSoir" },
    { cle: "nuit", idListe: "listeNuit" }
  ];

  config.forEach(function(item) {

    const liste = document.getElementById(item.idListe);
    liste.innerHTML = "";

    const consignes = JSON.parse(localStorage.getItem(item.cle)) || [];

    if (consignes.length === 0) {
      const li = document.createElement("li");
      li.className = "vide";
      li.textContent = "Aucune consigne";
      liste.appendChild(li);
      return;
    }

    consignes.forEach(function(c, index) {

      const li = document.createElement("li");

      li.innerHTML =
        "<strong>" + c.nom + "</strong>" +
        " — Chambre " + c.chambre +
        "<br>" + c.message +
        "<br><small>" + c.date + "</small>" +
        "<br><button onclick=\"supprimerConsigne('" + item.cle + "'," + index + ")\">Supprimer</button>";

      liste.appendChild(li);

    });

  });

}

function supprimerConsigne(shift, index) {

  const consignes = JSON.parse(localStorage.getItem(shift)) || [];
  consignes.splice(index,1);

  localStorage.setItem(shift, JSON.stringify(consignes));

  afficherConsignes();
  afficherHistorique();
  afficherChambres();
  afficherDashboard();
}

function afficherHistorique() {

  const zone = document.getElementById("historiqueJours");
  if (!zone) return;

  zone.innerHTML = "";

  const toutes = recupererToutesLesConsignes();

  if (toutes.length === 0) {
    zone.innerHTML = "<p>Aucun historique</p>";
    return;
  }

  toutes.reverse().forEach(function(c){

    const div = document.createElement("div");

    div.innerHTML =
      "<strong>" + c.nom + "</strong>" +
      " — Chambre " + c.chambre +
      "<br>" + c.message +
      "<br><small>" + c.date + "</small><br><br>";

    zone.appendChild(div);

  });

}

function afficherChambres() {

  const grille = document.getElementById("grilleChambres");
  if (!grille) return;

  grille.innerHTML = "";

  const toutes = recupererToutesLesConsignes();

  for (let i = 1; i <= 27; i++) {

    const chambreNumero = String(i);

    const consignes = toutes.filter(function(c){
      return c.chambre === chambreNumero;
    });

    let statutClasse = "chambre-vide";
    let statutTexte = "Aucun signalement";
    let message = "Rien à signaler";

    if (consignes.length > 0) {

      const derniere = consignes[consignes.length - 1];

      if (derniere.statut === "urgent") statutClasse = "chambre-urgent";
      if (derniere.statut === "attention") statutClasse = "chambre-attention";
      if (derniere.statut === "ok") statutClasse = "chambre-ok";

      statutTexte = derniere.statut;
      message = derniere.message;

    }

    const carte = document.createElement("div");

    carte.className = "carte-chambre " + statutClasse;

    carte.onclick = function(){
      afficherHistoriqueChambre(i);
    };

    carte.innerHTML =
      "<h4>Chambre " + i + "</h4>" +
      "<p>Statut : " + statutTexte + "</p>" +
      "<p>" + message + "</p>";

    grille.appendChild(carte);

  }

}

function afficherHistoriqueChambre(numero){

  const toutes = recupererToutesLesConsignes();

  const consignes = toutes.filter(function(c){
    return c.chambre === String(numero);
  });

  const popup = document.getElementById("popupChambre");
  const titre = document.getElementById("popupTitre");
  const contenu = document.getElementById("popupContenu");

  titre.textContent = "Historique chambre " + numero;
  contenu.innerHTML = "";

  if (consignes.length === 0) {
    contenu.innerHTML = "<p>Aucune remarque</p>";
    popup.style.display = "flex";
    return;
  }

  consignes.forEach(function(c){

    const div = document.createElement("div");
    div.className = "popup-item";

    div.innerHTML =
      "<strong>" + c.nom + "</strong>" +
      "<br>" + c.message +
      "<br><small>" + c.date + "</small>";

    contenu.appendChild(div);

  });

  popup.style.display = "flex";

}

function fermerPopup(){
  document.getElementById("popupChambre").style.display = "none";
}

function afficherDashboard(){

  const toutes = recupererToutesLesConsignes();

  document.getElementById("totalConsignes").textContent = toutes.length;

  let urgent = 0;
  let attention = 0;

  toutes.forEach(function(c){

    if (c.statut === "urgent") urgent++;
    if (c.statut === "attention") attention++;

  });

  document.getElementById("totalUrgent").textContent = urgent;
  document.getElementById("totalAttention").textContent = attention;
  document.getElementById("totalOK").textContent = 27 - urgent - attention;

}

window.onload = function(){

  afficherConsignes();
  afficherHistorique();
  afficherChambres();
  afficherDashboard();

  const nom = localStorage.getItem("receptionniste");

  if (nom) {
    document.getElementById("userName").textContent = nom;
  }

};
