async function fetchArticleDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("article-container").textContent =
      "ID d'article manquant.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/articles/${id}`);
    const article = await res.json();

    if (!res.ok) {
      document.getElementById("article-container").textContent =
        article.message;
      return;
    }

    const container = document.getElementById("article-container");

    container.innerHTML = `
      <h2>${article.titre}</h2>
      <p><strong>Auteur :</strong> ${article.auteur}</p>
      <p><strong>Date :</strong> ${new Date(
        article.date_publication
      ).toLocaleDateString()}</p>
      <hr />
      <p>${article.contenu}</p>
    `;
  } catch (err) {
    document.getElementById("article-container").textContent = "Error.";
  }
}

fetchArticleDetails();
