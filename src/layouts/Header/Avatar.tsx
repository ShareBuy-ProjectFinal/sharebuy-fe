import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Image, MenuProps } from 'antd';
import { auth } from 'configs/firebaseConfig';
import { useUser } from 'contexts/UserProvider';
import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';

const Avatar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useUser();

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
        <div className="w-20 min-w-max text-right">{user?.full_name}</div>
        <Image
          height={34}
          width={34}
          preview={false}
          src={
            user?.image ||
            'https://lh3.googleusercontent.com/a/ACg8ocLEj7a2TB9bRl7qQUhE6Nln0jUfn2qzQwDh2yHJKtje5bQZXg=s96-c'
          }
          className="rounded-full border"
        />
      </Flex>
    </Dropdown>
  );
};

export default Avatar;
