import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { PATH } from './Path';
import { MainLayout } from 'layouts/MainLayout';
import Login from 'pages/Auth/LogIn/Login';
import {
  CategoryPage,
  CustomerPage,
  DashboardPage,
  InboxPage,
  OrderPage,
  ProdcutPage,
  RegisterPage,
  ReportPage,
  SaleDealPage,
} from 'pages';
import ForgotPasswordPage from 'pages/Auth/ForgotPassword/ForgotPasswordPage';
import RevenueDashboardPage from 'pages/Dashboard/RevenueDashboardPage';
import AddProductPage from 'pages/Product/AddProductPage';
import CategoryDetailPage from 'pages/Category/CategoryDetailPage';
import ProductDetail from 'pages/Product/ProductDetail';

export const Router = () => {
  const token = localStorage.getItem('token');
  const routers: RouteObject[] = [
    {
      path: PATH.home,
      element: <MainLayout />,
      children: [
        {
          path: PATH.home,
          element: <DashboardPage />,
        },
        {
          path: PATH.dashboard,
          element: <DashboardPage />,
        },
        {
          path: PATH.revenueDashboard,
          element: <RevenueDashboardPage />,
        },
        {
          path: PATH.product,
          element: <ProdcutPage />,
        },
        {
          path: PATH.addProduct,
          element: <AddProductPage />,
        },
        {
          path: PATH.productDetail,
          element: <ProductDetail />,
        },
        {
          path: PATH.order,
          element: <OrderPage />,
        },
        {
          path: PATH.category,
          element: <CategoryPage />,
        },
        {
          path: PATH.categoryDetail,
          element: <CategoryDetailPage />,
        },
        {
          path: PATH.customer,
          element: <CustomerPage />,
        },
        {
          path: PATH.report,
          element: <ReportPage />,
        },
        {
          path: PATH.salesdeal,
          element: <SaleDealPage />,
        },
        {
          path: PATH.chat,
          element: <InboxPage />,
        },
        {
          path: PATH.Knowledge,
          element: <div className="bg-red-300 h-full">Knowledge</div>,
        },
        {
          path: PATH.productUpdates,
          element: <div className="bg-red-300 h-full">ProductUpdates</div>,
        },
        {
          path: PATH.settingsUser,
          element: <div className="bg-red-300 h-full">SettingsUser</div>,
        },
        {
          path: PATH.settingsCommunity,
          element: <div className="bg-red-300 h-full">SettingsCommunity</div>,
        },
        {
          path: PATH.profile,
          element: <div className="bg-red-300 h-full">Profile</div>,
        },
        {
          path: PATH.settingsUser,
          element: <div className="bg-red-300 h-full">SettingsUser</div>,
        },
        {
          path: PATH.settingsCommunity,
          element: <div className="bg-red-300 h-full">SettingsCommunity</div>,
        },
      ],
    },
    { path: PATH.all, element: <Navigate to={`${PATH.dashboard}`} /> },
    ...(token
      ? []
      : [
          { path: PATH.login, element: <Login /> },
          { path: PATH.register, element: <RegisterPage /> },
          { path: PATH.forgotPassword, element: <ForgotPasswordPage /> },
        ]),
  ];
  const router = createBrowserRouter(routers);
  return <RouterProvider router={router} />;
};
