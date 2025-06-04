import pool from "./db.js";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

app.use(express.static("src"));
app.use(express.json());

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "src" });
});

app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "src" });
});

app.get("/article", (req, res) => {
  res.sendFile("article.html", { root: "src" });
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.post("/register", async (req, res) => {
  try {
    const { email, mdp } = req.body;

    const requestQueryEmailUser = await pool.query(
      "SELECT * FROM T_USER WHERE email = $1",
      [email]
    );

    if (email && mdp) {
      if (requestQueryEmailUser.rowCount === 1) {
        res.status(409).json({ message: "email already exist !" });
      } else {
        await pool.query("INSERT INTO T_USER (email, mdp) VALUES ($1, $2)", [
          email,
          mdp,
        ]);
        res.status(201).json({ message: "User created" });
      }
    } else {
      res
        .status(400)
        .json({ message: "User not created ! Check email or password !" });
    }
  } catch (err) {
    console.error("Erreur dans /register:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, mdp } = req.body;

  if (!email || !mdp) {
    return res.status(400).json({ message: "Email or password missing!" });
  }

  const requestQueryUser = await pool.query(
    "SELECT id, email FROM T_USER WHERE email = $1 AND mdp = $2",
    [email, mdp]
  );

  if (requestQueryUser.rowCount === 1) {
    const token = jwt.sign(
      {
        id: requestQueryUser.rows[0].id,
        email: requestQueryUser.rows[0].email,
      },
      "jaimelescookies"
    );

    return res
      .status(200)
      .json({ message: "Login successful", access_token: token });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Access unauthorized !" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, "jaimelescookies");
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token !" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// parties bibliothèque

app.post("/articles", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or Invalid Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, "jaimelescookies");

    const { titre, contenu } = req.body;

    if (!titre || !contenu) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const now = new Date();

    await pool.query(
      `INSERT INTO T_ARTICLE (titre, contenu, date_publication, auteur_id)
       VALUES ($1, $2, $3, $4)`,
      [titre, contenu, now, user.id]
    );

    res.status(201).json({ message: "Article créé" });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.get("/articles", async (req, res) => {
  const result = await pool.query(
    `SELECT a.id, a.titre, a.date_publication, u.email AS auteur
     FROM T_ARTICLE a
     JOIN T_USER u ON a.auteur_id = u.id
     ORDER BY a.date_publication DESC`
  );
  res.status(200).json(result.rows);
});

app.get("/articles/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT a.id, a.titre, a.contenu, a.date_publication, u.email AS auteur
     FROM T_ARTICLE a
     JOIN T_USER u ON a.auteur_id = u.id
     WHERE a.id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.status(200).json(result.rows[0]);
});

app.get("/create-article", (req, res) => {
  res.sendFile("create-article.html", { root: "src" });
});
