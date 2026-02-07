import { AuthProvider, useAuth } from "./auth/AuthProvider";
import Login from "./features/Login";
import Dashboard from "./features/Dashboard";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // 🔐 Auth-based rendering
  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
