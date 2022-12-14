import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./features/admin/categories/categoriesSlice";
import ordersSlice from "./features/admin/orders/OrdersSlice";
import productsSlice from "./features/admin/products/productsSlice";
import usersSlice from "./features/user/usersSlice";
import cartSlice from "./features/main/cart/cartSlice";

const store = configureStore({
  reducer: {
    orders: ordersSlice,
    products: productsSlice,
    categories: categoriesSlice,
    user: usersSlice,
    cart: cartSlice,
  },
});

export default store;
