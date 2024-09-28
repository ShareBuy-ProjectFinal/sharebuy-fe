import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MainHeader } from './Header/MainHeader';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { PageTitle } from './Header/PageTitle';
import { Content } from 'antd/es/layout/layout';
import { auth } from 'configs/firebaseConfig';
import { PATH } from 'routes/Path';
// import { Content } from 'antd/es/layout/layout';

export const MainLayout = () => {
  // const isToken = localStorage.getItem('token');
  // if (!isToken) {
  //   return <Navigate to={`${PATH.login}`} />;
  // }
  return (
    <Layout className="min-h-screen">
      <MainHeader />
      <Layout className="mt-0 bg-[#fef7f5]">
        <Sidebar />
        <Content>
          {/* <PageTitle /> */}
          <div
            // className="h-[calc(100%-2.5rem)]"
            className="h-full"
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
