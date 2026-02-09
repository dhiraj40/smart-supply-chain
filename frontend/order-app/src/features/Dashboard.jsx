import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthProvider";
import Items from "./Items";

export default function Dashboard(props) {
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { onSelectItem } = props

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiFetch("/items");
        console.log(typeof data, data);
        setItems(JSON.parse(data));
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
      <h2 className="textA">Dashboard</h2>
      <Items items={items} onSelectItem={onSelectItem} />
      <button onClick={logout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    margin: "10px auto",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
};
