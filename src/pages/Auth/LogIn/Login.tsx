import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { auth, providerFacebook, providerGoogle } from 'configs/firebaseConfig';
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
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PATH } from 'routes/Path';
import { toastError } from 'utils/toats';

const Login = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [value, setValue] = useState('');

  const { mutate: mutateLoginGoogle, isPending: isPendingLoginGoogle } =
    useMutation({
      mutationFn: () => signInWithPopup(auth, providerGoogle),
      onSuccess: (result: any) => {
        console.log('result', result);
        navigate('/');
      },
      onError: (error: any) => {
        console.log('Login error: ', error);
      },
    });

  const { mutate: mutateLoginFaceBook, isPending: isPendingLoginFaceBook } =
    useMutation({
      mutationFn: () => signInWithPopup(auth, providerFacebook),
      onSuccess: (result: any) => {
        console.log('result', result);
        navigate('/');
      },
      onError: (error: any) => {
        console.log('Login error: ', error);
      },
    });

  const mutateLogin = useMutation({
    mutationFn: () =>
      signInWithEmailAndPassword(
        auth,
        form.getFieldValue('email'),
        form.getFieldValue('password'),
      ),
    onSuccess: (result: any) => {
      console.log('result', result);
      navigate('/');
    },
    onError: (error: any) => {
      console.log('Login error: ', error);
      toastError('Email hoặc mật khẩu không đúng');
    },
  });

  useEffect(() => {
    // setValue(localStorage.getItem('email') || '');
    // console.log('auth', auth);
  }, []);

  const onFinish = (values: any) => {
    console.log('Success:', values);
    mutateLogin.mutate();
    // navigate('/');
  };

  const getFieldError = (name: any) => {
    return form.getFieldError(name);
  };

  return (
    <Spin spinning={false} size="large">
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
            <Typography.Title level={1} className="!mb-5">
              Đăng nhập
            </Typography.Title>
            <Form.Item
              name="email"
              className="mb-9"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <FloatInput
                label="Email"
                placeholder="Nhập email"
                name="email"
                getFieldError={getFieldError}
              />
            </Form.Item>
            <Form.Item
              name="password"
              className="mb-6"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message:
                    'Có 8 kí tự, ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
                },
              ]}
            >
              <FloatInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                name="password"
                getFieldError={getFieldError}
                password
              />
            </Form.Item>
            <Form.Item className="mb-2">
              <Flex justify="space-between" align="center">
                <Form.Item valuePropName="checked" noStyle>
                  <Checkbox>Lưu mật khẩu</Checkbox>
                </Form.Item>
                <Link to={PATH.forgotPassword}>
                  <span className="text-[#FF8682]">Quên mật khẩu?</span>
                </Link>
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
              gap={15}
              vertical
            >
              <Typography.Text className="font-semibold">
                Không có tài khoản?{' '}
                <Link to={PATH.register}>
                  <span className="text-[#FF8682]">
                    <span className="text-[#FF8682]">Đăng kí</span>
                  </span>
                </Link>
              </Typography.Text>
              <Divider
                style={{
                  color: '#CBCBCB',
                  borderColor: '#CBCBCB',
                  marginBottom: 5,
                  marginTop: 5,
                }}
              >
                Hoặc đăng nhập với
              </Divider>
            </Flex>
            <Flex justify="space-between" align="center">
              <ButtonCustom
                icon={<Facebook />}
                onClick={() => mutateLoginFaceBook()}
                htmlType="button"
              />
              <ButtonCustom
                icon={<GoogleIcon />}
                onClick={() => mutateLoginGoogle()}
                htmlType="button"
              />
              <ButtonCustom
                icon={<AppleIcon />}
                onClick={() => mutateLoginGoogle()}
                htmlType="button"
              />
            </Flex>
          </Form>
        </Flex>
        <div
          className="w-1/2 bg-center bg-cover"
          style={{ backgroundImage: `url(${Background})` }}
        />
      </Flex>
    </Spin>
  );
};

export default Login;
