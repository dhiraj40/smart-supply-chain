import { useState } from "react";
// import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // const data = await apiFetch("/login", {
      //   method: "POST",
      //   body: { username, password },
      // });

      // backend returns: { access_token: "..." }
      // login(data.access_token);
      await login(username, password)
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 300,
    margin: "100px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
};
