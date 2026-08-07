import { Route, Routes } from "react-router-dom";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import InstagramGallery from "./pages/admin/InstagramGallery";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import AccountProfile from "./pages/AccountProfile";
import AccountOrders from "./pages/AccountOrders";
import AccountOrderDetail from "./pages/AccountOrderDetail";
import AccountAddresses from "./pages/AccountAddresses";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCustomers from "./pages/admin/AdminCustomers";

function App() {
  return (
    <Routes>
      {/* Admin panel — its own layout (sidebar), deliberately outside
          the storefront Layout (no navbar/footer/announcement bar). */}
      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="customers" element={<AdminCustomers />}/>
          <Route path="gallery" element={<InstagramGallery />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="shop" element={<Shop />} />
        <Route path="shop/:categorySlug" element={<CategoryPage />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="category/:categorySlug" element={<CategoryPage />} />

        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success/:orderNumber" element={<OrderSuccess />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<Account />}>
            <Route index element={<AccountProfile />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:orderNumber" element={<AccountOrderDetail />} />
            <Route path="addresses" element={<AccountAddresses />} />
          </Route>
        </Route>

        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="refund-policy" element={<RefundPolicy />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
