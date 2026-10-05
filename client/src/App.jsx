import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import FeedbackFooter from "./components/FeedbackFooter";
import Admin from "./pages/Admin";
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/mohan" element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>

        <FeedbackFooter />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
