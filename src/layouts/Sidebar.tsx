import {
  AppstoreOutlined,
  LeftOutlined,
  MailOutlined,
  RightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import {
  CategoryIcon,
  Chat,
  CustomerIcon,
  DashboardIcon,
  HomeIcon,
  KnowledgeIcon,
  OrderIcon,
  ProductIcon,
  ProductUpdatesIcon,
  ReportIcon,
  SalesdealIcon,
  SettingsCommunityIcon,
  UserIcon,
} from 'assets/svgs';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import {
  arraysEqual,
  findAllIndices,
  removeElementsByIndices,
} from 'utils/constants';

type MenuItem = Required<MenuProps>['items'][number];

const selectedKeys = [
  [PATH.dashboard, PATH.revenueDashboard, PATH.home],
  [PATH.order],
  [PATH.product, PATH.addProduct],
  [PATH.category, PATH.categoryDetail],
  [PATH.customer],
  [PATH.report],
  [PATH.salesdeal],
  [PATH.chat],
  [PATH.Knowledge],
  [PATH.productUpdates],
  [PATH.settingsUser],
  [PATH.settingsCommunity],
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type: 'item' | 'submenu' | 'group' | 'divider' = 'item',
  ) => {
    return {
      key,
      icon,
      children,
      label,
      type,
      onClick: (item) => navigate(item.key),
    } as MenuItem;
  };

  const getSelectedKey = (pathname: string) => {
    for (const keys of selectedKeys) {
      if (keys.includes(pathname)) {
        return keys;
      }
      for (const key of keys) {
        if (key.includes(':id')) {
          let resultkey = key.split('/');
          let resultPath = pathname.split('/');
          const indexs = findAllIndices(resultkey, ':id');

          resultkey = removeElementsByIndices(resultkey, indexs);
          resultPath = removeElementsByIndices(resultPath, indexs);
          if (arraysEqual(resultkey, resultPath)) return keys;
        }
      }
    }
    return [pathname];
  };

  const items: MenuItem[] = [
    getItem('Dashboard', PATH.dashboard, <HomeIcon />),
    getItem('Đặt hàng', PATH.order, <OrderIcon />),
    getItem('Sản phẩm', PATH.product, <ProductIcon />),
    getItem('Phân loại', PATH.category, <CategoryIcon />),
    getItem('Khách hàng', PATH.customer, <CustomerIcon />),
    getItem('Báo cáo', PATH.report, <ReportIcon />),
    getItem('Mã giãm giá', PATH.salesdeal, <SalesdealIcon />),
    getItem('Tin nhắn', PATH.chat, <Chat />),
    getItem(
      'Thông tin khác',
      'otherInfo',
      null,
      [
        getItem('Knowledge Base', PATH.Knowledge, <KnowledgeIcon />),
        getItem('Product Updates', PATH.productUpdates, <ProductUpdatesIcon />),
      ],
      'group',
    ),
    getItem(
      'Cài đặt',
      'settings',
      null,
      [
        getItem('Cài đặt cá nhân', PATH.settingsUser, <UserIcon />),
        getItem(
          'Cài đặt cộng đồng',
          PATH.settingsCommunity,
          <SettingsCommunityIcon />,
        ),
      ],
      'group',
    ),
  ];

  return (
    <Sider
      collapsible
      width={262}
      trigger={null}
      collapsed={collapsed}
      theme="light"
      className="drop-shadow-lg relative"
    >
      <div
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute bg-white cursor-pointer top-[75px] right-[-10px] w-[24px] h-[24px] leading-[24px] rounded-full shadow-sm text-center border z-10"
      >
        {collapsed ? <RightOutlined /> : <LeftOutlined />}
      </div>
      <Menu
        mode="inline"
        theme="dark"
        items={items}
        defaultOpenKeys={location.state?.key ? [location.state.key] : []}
        selectedKeys={getSelectedKey(location.pathname)}
        onSelect={(e) => {
          navigate(e.keyPath[0], {
            state: { key: e.keyPath.length > 1 ? e.keyPath[1] : undefined },
          });
        }}
        className="bg-[#1f264f] h-full"
      />
    </Sider>
  );
};
