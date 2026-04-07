import { Provider } from 'react-redux';
import store from './storage/stateStore';
import DeliveryApp from './presentation/DeliveryApp';

function App() {
  return (
    <Provider store={store}>
      <DeliveryApp />
    </Provider>
  );
}

export default App;
