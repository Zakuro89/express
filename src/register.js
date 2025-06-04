let registerBtn = document.querySelector("#register-btn");
let errorSpan = document.querySelector("#error");

registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, mdp: password }),
  });

  const data = await response.json();

  if (response.status === 201) {
    alert("Inscription réussie ! 🍪 ");
    window.location.href = "login.html";
  } else {
    errorSpan.textContent = data.message;
    errorSpan.style.color = "#fff";
  }
});
