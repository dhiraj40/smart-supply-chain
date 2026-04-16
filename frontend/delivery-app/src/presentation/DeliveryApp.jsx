import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { ListGroup, Button, Badge } from "react-bootstrap";
import { useState } from "react";
import OrderPage from "./pages/OrderPage";
import SettingPage from "./pages/SettingPage";
import AppLayout from "./components/layout/AppLayout";

const PAGES = {
  DASHBOARD: "DASHBOARD",
  CART: "CART",
  SETTINGS: "SETTINGS",
};

const ActiveDeliveryPage = ({ activePage, setActivePage, user }) => {
  const cartQuantities = useSelector((store) => store.cart?.cart || {});
  const sidebar = (
    <ListGroup variant="flush">
      <ListGroup.Item
        action
        href="#dashboard"
        onClick={() => setActivePage(PAGES.DASHBOARD)}
        active={activePage === PAGES.DASHBOARD}
      >
        Dashboard
      </ListGroup.Item>
      <ListGroup.Item
        action
        href="#cart"
        onClick={() => setActivePage(PAGES.CART)}
        active={activePage === PAGES.CART}
      >
        Orders
      </ListGroup.Item>
      <ListGroup.Item
        action
        href="#settings"
        onClick={() => setActivePage(PAGES.SETTINGS)}
        active={activePage === PAGES.SETTINGS}
      >
        Settings
      </ListGroup.Item>
    </ListGroup>
  );

  const topbarRight = (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => setActivePage(PAGES.CART)}
    >
      <span role="img" aria-label="cart" style={{ marginRight: "0.5rem" }}>
        🛒
      </span>
      Cart <Badge>{Object.values(cartQuantities).reduce((sum, val) => sum + val, 0)}</Badge>
    </Button>
  );

  return (
    <AppLayout sidebar={sidebar} topbarRight={topbarRight}>
      {activePage === PAGES.CART ? (
        <OrderPage />
      ) : activePage === PAGES.SETTINGS ? (
        <SettingPage />
      ) : (
        <HomePage user={user} />
      )}
    </AppLayout>
  );
};

const DeliveryApp = () => {
  const authState = useSelector((state) => state.auth);
  const [activePage, setActivePage] = useState(PAGES.DASHBOARD);

  return (
    <div className="App">
      {authState.isAuthenticated ? (
        <ActiveDeliveryPage activePage={activePage} setActivePage={setActivePage} user={authState.user} />
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default DeliveryApp;
