import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { logout } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiFetch("/orders");
        setMessage(data.message);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <h2>Loading dashboard...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>

      <p>{message}</p>

      <button onClick={logout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "100px auto",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
};
