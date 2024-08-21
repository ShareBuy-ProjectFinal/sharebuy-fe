import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Image, MenuProps } from 'antd';
import { auth } from 'configs/firebaseConfig';
import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';

const Avatar = () => {
  const navigate = useNavigate();
  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    auth.signOut();
    navigate(PATH.login);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to={`${PATH.profile}`}>Tài khoản</Link>,
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: <a onClick={signOut}>Đăng xuất</a>,
      icon: <LogoutOutlined />,
    },
  ];
  return (
    <Dropdown
      menu={{ items }}
      className="max-h-max"
      arrow
      placement="bottomRight"
    >
      <Flex className="h-[30px] mr-5" justify="end" align="center" gap={10}>
        <div className="w-20 min-w-max text-right">Lê Hữu</div>
        <Image
          height={34}
          width={34}
          preview={false}
          className="rounded-full border"
        />
      </Flex>
    </Dropdown>
  );
};

export default Avatar;
