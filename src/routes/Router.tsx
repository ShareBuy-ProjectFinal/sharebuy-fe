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

export const Router = () => {
  const routers: RouteObject[] = [
    {
      path: PATH.home,
      element: <MainLayout />,
      children: [
        {
          path: PATH.home,
          element: <div className="bg-red-300 h-full">Home</div>,
        },
        {
          path: PATH.dashboard,
          element: <div className="bg-red-300 h-full">Dashboard</div>,
        },
        {
          path: PATH.product,
          element: <div className="bg-red-300 h-full">Product</div>,
        },
        {
          path: PATH.order,
          element: <div className="bg-red-300 h-full">Order</div>,
        },
        {
          path: PATH.category,
          element: <div className="bg-red-300 h-full">Category</div>,
        },
        {
          path: PATH.customer,
          element: <div className="bg-red-300 h-full">Customer</div>,
        },
        {
          path: PATH.report,
          element: <div className="bg-red-300 h-full">Report</div>,
        },
        {
          path: PATH.salesdeal,
          element: <div className="bg-red-300 h-full">Salesdeal</div>,
        },
        {
          path: PATH.chat,
          element: <div className="bg-red-300 h-full">Chat</div>,
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
    { path: PATH.login, element: <Login /> },
    // { path: PATH.all, element: <Navigate to={`${PATH.login}`} /> },
  ];
  const router = createBrowserRouter(routers);
  return <RouterProvider router={router} />;
};
