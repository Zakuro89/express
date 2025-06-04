async function fetchArticles() {
  const res = await fetch("http://localhost:3000/articles");
  const articles = await res.json();

  const container = document.getElementById("articles");

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("form");

    card.innerHTML = `
      <h2>${article.titre}</h2>
      <p><strong>Auteur :</strong> ${article.auteur}</p>
      <p><strong>Date :</strong> ${new Date(
        article.date_publication
      ).toLocaleDateString()}</p>
      <a href="article.html?id=${
        article.id
      }" style="color: yellow;">Voir l'article</a>
    `;

    container.appendChild(card);
  });
}

fetchArticles();
