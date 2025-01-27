/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Cette fonction affiche dans la console le score de l'utilisateur
 * @param {number} score : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 */
function afficherResultat(score, nbMotsProposes) {
    let spanScore = document.querySelector(".zoneScore span");
    let affichageScore = `${score} / ${nbMotsProposes}`;
    spanScore.innerText = affichageScore;
}

/**
 * Cette fonction affiche une proposition, que le joueur devra recopier, 
 * dans la zone "zoneProposition"
 * @param {string} proposition : la proposition à afficher
 */
function afficherProposition(proposition) {
    let zoneProposition = document.querySelector(".zoneProposition");
    zoneProposition.innerText = proposition;
}

/**
 * Cette fonction construit et affiche l'email. 
 * @param {string} nom : le nom du joueur
 * @param {string} email : l'email de la personne avec qui il veut partager son score
 * @param {string} score : le score. 
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`;
    location.href = mailto;
}

/**
 * Fonction pour valider le nom
 */
function validerNom() {
    const regex = /^[a-zA-Z]{2,}$/;
    const baliseNom = document.getElementById('nom');

    if (!regex.test(baliseNom.value.trim())){
        throw new Error ("Nom invalide")
    }
    
}

/**
 * Fonction pour valider l'email
 */
function validerEmail() {
    const regex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const baliseEmail = document.getElementById('email');

    if (!regex.test(baliseEmail.value.trim())){
        throw new Error ("Email invalide")
    }
    
}

function afficherMessageErreur(messageErreur){
    let zoneErreur=document.querySelector('.popup span')
    zoneErreur.innerText=messageErreur
}

/**
 * Fonction pour gerer le formulaire , prend en paramettre le score
 */
function gererFormulaire(getScore, getNbMotsProposes) {
    const form = document.querySelector('form');
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        let scoreEmail = `${getScore()}/${getNbMotsProposes()}`;

        try {
            validerEmail();
            validerNom();
            afficherMessageErreur("");
            afficherEmail(nom, email, scoreEmail);
        } catch (error) {
            afficherMessageErreur(error.message);
            console.log(error.message);
        }
    });
}
/**
 * Cette fonction lance le jeu. 
 * Elle demande à l'utilisateur de choisir entre "mots" et "phrases" et lance la boucle de jeu correspondante
 */
function lancerJeu() {
    // Initialisation de l'événement pour la popup
    initAddEventListenerPopup();

    // Variables initiales
    let score = 0;
    let i = 0;
    let listeProposition = listeMots;

    // Sélection des éléments du DOM
    let btnValiderMot = document.getElementById("btnValiderMot");
    let inputEcriture = document.getElementById("inputEcriture");
    let listeBtnRadio = document.querySelectorAll(".optionSource input");

    // Affiche la première proposition
    afficherProposition(listeProposition[i]);

    // Fonction pour gérer la validation d'une proposition
    const validerProposition = () => {
        if (inputEcriture.value === listeProposition[i]) {
            score++;
        }
        i++;
        afficherResultat(score, i);
        inputEcriture.value = '';

        if (listeProposition[i] === undefined) {
            afficherProposition("Le jeu est fini");
            btnValiderMot.disabled = true;
            inputEcriture.disabled = true;
        } else {
            afficherProposition(listeProposition[i]);
        }
    };

    // Gestion du clic sur le bouton "Valider"
    btnValiderMot.addEventListener("click", validerProposition);

    // Gestion de la touche "Entrée" dans le champ de saisie
    inputEcriture.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Empêche le comportement par défaut
            validerProposition(); // Valide la proposition
        }
    });

    // Gestion du changement des boutons radio pour alterner entre mots et phrases
    listeBtnRadio.forEach(btn => {
        btn.addEventListener("change", (event) => {
            listeProposition = event.target.value === "1" ? listeMots : listePhrases;
            i = 0; // Réinitialisation de l'index
            score = 0; // Réinitialisation du score
            afficherProposition(listeProposition[i]);
            afficherResultat(score, i);
            btnValiderMot.disabled = false; // Réactive le bouton "Valider"
            inputEcriture.disabled = false; // Réactive le champ de saisie
            inputEcriture.value = ''; // Réinitialise le champ de saisie
        });
    });

    // Initialise le formulaire pour l'envoi par email
    gererFormulaire(() => score, () => i);

    // Affiche le score initial
    afficherResultat(score, i);
}