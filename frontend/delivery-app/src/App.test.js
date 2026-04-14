import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form by default', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
