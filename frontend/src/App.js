import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import ManageProductsPage from './pages/ManageProductsPage';
import Navbar from './componenets/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProductsPage />} />
        <Route path="/manage-products" element={<ManageProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
