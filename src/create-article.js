const form = document.getElementById("article-form");
const errorSpan = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titre = document.getElementById("titre").value.trim();
  const contenu = document.getElementById("contenu").value.trim();
  const token = localStorage.getItem("accessToken");

  if (!titre || !contenu) {
    errorSpan.textContent = "Titre ou contenu manquant(s).";
    return;
  }

  if (!token) {
    errorSpan.textContent = "Vous devez être connecté pour créer un article.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titre, contenu }),
    });

    const data = await response.json();

    if (response.status === 201) {
      alert("Article créé avec succès !");
      window.location.href = "articles.html";
    } else {
      errorSpan.textContent = data.message || "Erreur lors de la création.";
    }
  } catch (err) {
    errorSpan.textContent = "Erreur réseau ou serveur.";
  }
});
