let logBtn = document.querySelector("#log-btn");
let span = document.querySelector("#error");

logBtn.addEventListener("click", login);

document.getElementById("register-btn").addEventListener("click", () => {
  window.location.href = "/register.html";
});

async function login(e) {
  e.preventDefault();

  let newUser = {
    email: document.querySelector("#email").value,
    mdp: document.querySelector("#password").value,
  };

  let response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  let data = await response.json();

  if (response.ok) {
    localStorage.setItem("accessToken", data.access_token);
    window.location.href = `profile.html`;
  } else {
    let spanError = document.createElement("p");

    spanError.textContent = "Accès refusé.";
    spanError.style.color = "#900";

    span.appendChild(spanError);
  }
}
