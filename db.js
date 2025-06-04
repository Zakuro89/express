import pg from "pg";

const { Pool } = pg;

export default new Pool({
  user: "alex", // ou process.env.DB_USER
  host: "db",
  database: "myapp",
  password: "123",
  port: 5432,
});
