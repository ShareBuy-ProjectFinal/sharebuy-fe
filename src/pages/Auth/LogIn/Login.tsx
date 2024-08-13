import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Background } from 'assets/images';
import {
  AppleIcon,
  Background_Login,
  EyeIcon,
  EyeOffIcon,
  Facebook,
  GoogleIcon,
  LogoAuth,
} from 'assets/svgs';
import ButtonCustom from 'components/Button/ButtonCustom';
import FloatInput from 'components/Input/FloatInput';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    navigate('/');
  };
  const loginFaceBook = () => {
    console.log('Login with facebook');
  };
  return (
    <Flex className="h-screen" justify="space-between">
      <Flex
        className="w-1/2"
        vertical
        justify="flex-start"
        align="center"
        gap={10}
      >
        <LogoAuth />
        <Form
          form={form}
          size="small"
          className="w-3/5"
          layout="vertical"
          onFinish={onFinish}
        >
          <Typography.Title level={1} className="!mb-8">
            Đăng nhập
          </Typography.Title>
          <Form.Item name="email">
            <FloatInput label="Email" placeholder="Email here please" />
          </Form.Item>
          <Form.Item name="password">
            <FloatInput
              label="Password"
              placeholder="Password here please"
              password
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item valuePropName="checked" noStyle>
                <Checkbox>Lưu mật khẩu</Checkbox>
              </Form.Item>
              <a href="">
                <span className="text-[#FF8682]">Quên mật khẩu?</span>
              </a>
            </Flex>
          </Form.Item>
          <Form.Item noStyle>
            <Button
              size={'large'}
              className="bg-[#515DEF] text-white font-normal"
              block
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Flex
            justify="center"
            align="center"
            className="my-5"
            gap={5}
            vertical
          >
            <Typography.Text className="font-semibold">
              Không có tài khoản?{' '}
              <a href="">
                <span className="text-[#FF8682]">Đăng kí</span>
              </a>
            </Typography.Text>
            <Divider style={{ color: '#CBCBCB', borderColor: '#CBCBCB' }}>
              Hoặc đăng nhập với
            </Divider>
          </Flex>
          <Flex justify="space-between" align="center">
            <ButtonCustom icon={<Facebook />} onClick={loginFaceBook} />
            <ButtonCustom icon={<GoogleIcon />} />
            <ButtonCustom icon={<AppleIcon />} />
          </Flex>
        </Form>
      </Flex>
      <div
        className="w-1/2 bg-center bg-cover"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </Flex>
  );
};

export default Login;
