async function getProfile() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:3000/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();

    const welcomeMessage = document.createElement("h2");
    welcomeMessage.textContent = `Bienvenue, ${data.user.email} !`;
    document.body.prepend(welcomeMessage);
  } else if (response.status === 401) {
    console.error("Token manquant ou invalide.");
    window.location.href = "/login.html";
  } else {
    console.error("Erreur inconnue.");
  }
}

getProfile();
