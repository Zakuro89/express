async function getProfile() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:3000/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();

    // Ajoute le message dans le HTML
    const welcomeMessage = document.createElement("h2");
    welcomeMessage.textContent = `Bienvenue, ${data.user.email} !`;
    document.body.prepend(welcomeMessage); // ou remplace par l'endroit souhaité
  } else if (response.status === 401) {
    console.error("Token manquant ou invalide.");
    window.location.href = "/login.html"; // redirection si non connecté
  } else {
    console.error("Erreur inconnue.");
  }
}

getProfile();
