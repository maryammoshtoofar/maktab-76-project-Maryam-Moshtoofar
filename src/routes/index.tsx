import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HOME_ROUTE,
  CATEGORY_ROUTE,
  PRODUCT_ROUTE,
  CART_ROUTE,
  CHECKOUT_ROUTE,
  REDIRECT_ROUTE,
  LOGIN_ROUTE,
  PRODUCTS_MANAGEMENT_ROUTE,
  STOCK_PRICE_ROUTE,
  ORDERS_ROUTE,
} from "../config/routes";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Product from "../pages/product";
import Category from "../pages/Category";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Redirect from "../pages/Redirect";
import Login from "../pages/login";
import AdminLayout from "../layouts/AdminLayout";
import ProductsManagement from "../pages/ProductsManagement";
import StockPrice from "../pages/stockPrice";
import Orders from "../pages/orders";
import NotFound from "../pages/notfound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={HOME_ROUTE} element={<Home />} />
          <Route path={CATEGORY_ROUTE} element={<Category />} />
          <Route path={PRODUCT_ROUTE} element={<Product />} />
          <Route path={CART_ROUTE} element={<Cart />} />
          <Route path={CHECKOUT_ROUTE} element={<Checkout />} />
          <Route path={REDIRECT_ROUTE} element={<Redirect />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path={LOGIN_ROUTE} element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route
            path={PRODUCTS_MANAGEMENT_ROUTE}
            element={<ProductsManagement />}
          />
          <Route path={STOCK_PRICE_ROUTE} element={<StockPrice />} />
          <Route path={ORDERS_ROUTE} element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
