import { createHashRouter } from "react-router";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../views/front/Home";
import Products from "../views/front/Products";
import SingleProduct from "../views/front/SingleProduct";
import Cart from "../views/front/Cart";
import FrontNotFound from "../views/front/FrontNotFound";
import Login from "../views/back/Login";
import AdminProducts from "../views/back/AdminProducts";
import CheckOut from "../views/front/CheckOut";
import AdminPayout from "../layout/AdminLayout";
import AdminOrders from "../views/back/AdminOrders";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createHashRouter([
    {
        path: '/',
        element: <FrontendLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'products',
                element: <Products />
            },
            {
                path: 'product/:id',
                element: <SingleProduct />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'checkout',
                element: <CheckOut />
            },
        ]
    }, {
        path: 'login',
        element: <Login />
    }, {
        path: 'admin',
        element: (
            <ProtectedRoute>
              <AdminPayout />
            </ProtectedRoute>),
        children: [
            {
                path: 'products',
                element: <AdminProducts />
            },
            {
                path: 'orders',
                element: <AdminOrders />
            },
        ]
    },
    {
        path: '*',
        element: <FrontNotFound />
    }
])