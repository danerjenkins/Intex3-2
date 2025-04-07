import './App.css';
import CompetitionPage from './pages/CompetitionPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import CookieConsent from 'react-cookie-consent';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CompetitionPage />} />
            <Route path="/competition" element={<CompetitionPage />} />
            <Route
              path="/product/:rootbeerName/:rootbeerId/:currentRetailPrice"
              element={<ProductPage />}
            />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
      <CookieConsent />
    </>
  );
}

export default App;
