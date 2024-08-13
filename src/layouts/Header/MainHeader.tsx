import { Button, Flex, Image, Input, Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Bell, Chat, LogoMenu, Search } from 'assets/svgs';
import React from 'react';
import Avatar from './Avatar';
import { Navigate, useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';

export const MainHeader = () => {
  const navigate = useNavigate();
  const [isFocus, setIsFocus] = React.useState(false);
  return (
    <Header className="bg-[#070B1D] p-0 m-0 flex justify-between items-center">
      <div className="w-[262px]">
        <LogoMenu
          className="cursor-pointer"
          onClick={() => navigate(PATH.home)}
        />
      </div>
      <Flex
        justify="space-between"
        align="center"
        className="bg-[#070B1D] flex-grow"
      >
        <Input
          placeholder="TÌm kiếm"
          prefix={<Search />}
          className="w-[200px] ml-5 rounded-3xl bg-gray-400"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <Flex align="center" className="text-white" gap={10}>
          <Button icon={<Chat />} className="bg-transparent border-none " />
          <Button icon={<Bell />} className="bg-transparent border-none" />
          <Avatar />
        </Flex>
      </Flex>
    </Header>
  );
};
