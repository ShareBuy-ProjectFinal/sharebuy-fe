import { Layout } from 'antd';
import React from 'react';
import { Sidebar } from './Sidebar';
import { MainHeader } from './Header/MainHeader';
import { Outlet } from 'react-router-dom';
import { PageTitle } from './Header/PageTitle';
import { Content } from 'antd/es/layout/layout';
// import { Content } from 'antd/es/layout/layout';

export const MainLayout = () => {
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
