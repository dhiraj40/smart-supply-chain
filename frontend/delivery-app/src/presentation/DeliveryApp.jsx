import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const DeliveryApp = () => {

  const authState = useSelector(state => state.auth);

  return (
    <div className="App">
      <h1>Delivery App</h1>
      {authState.isAuthenticated ? <HomePage user={authState.user} /> : <LoginPage />}
    </div>
  );
}

export default DeliveryApp;
