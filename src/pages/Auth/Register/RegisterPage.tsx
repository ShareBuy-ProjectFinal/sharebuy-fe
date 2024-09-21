import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Spin,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import AuthApi from 'apis/AuthApis';
import { Background } from 'assets/images';
import { AppleIcon, Facebook, GoogleIcon, LogoAuth } from 'assets/svgs';
import ButtonCustom from 'components/Button/ButtonCustom';
import FloatInput from 'components/Input/FloatInput';
import LoginOrther from 'components/Login/LoginOrther';
import { auth, providerGoogle } from 'configs/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { toastError } from 'utils/toats';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [isErrorFirstName, setIsErrorFirstName] = useState(false);

  const mutateRegister = useMutation({
    mutationFn: () =>
      createUserWithEmailAndPassword(
        auth,
        form.getFieldValue('email'),
        form.getFieldValue('password'),
      ),
    onSuccess: (result: any) => {
      console.log('result', result);
      const values = form.getFieldsValue();
      createUser({
        user_name: `${values.firstName} ${values.lastName}`,
        full_name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone_number: values.phone_number,
        role: 'SHOP',
      });
    },
    onError: (error: any) => {
      console.log('Register error: ', error);
      toastError('Đăng ký thất bại, vui lòng thử lại');
    },
  });

  const { mutate: createUser } = useMutation({
    mutationFn: AuthApi.createUser,
    onSuccess: (response) => {
      auth.signOut();
      window.location.href = '/login';
    },
    onError: (error) => {
      console.log('error createUser', error);
    },
  });

  const onFinish = (values: any) => {
    // console.log('Success:', values);
    mutateRegister.mutate();
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
          gap={0}
        >
          <LogoAuth />
          <Form
            form={form}
            size="small"
            className="w-3/5"
            layout="vertical"
            onFinish={onFinish}
          >
            <Typography.Title level={1} className="!mb-3">
              Đăng ký
            </Typography.Title>
            <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  className="mb-8"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
                  ]}
                >
                  <FloatInput
                    label="Họ"
                    placeholder="Nhập họ"
                    name="firstName"
                    getFieldError={getFieldError}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  className="mb-8"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
                  ]}
                >
                  <FloatInput
                    label="Tên"
                    placeholder="Nhập tên"
                    name="lastName"
                    getFieldError={getFieldError}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  className="mb-8"
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
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone_number"
                  className="mb-8"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    {
                      pattern: /^[0-9]+$/,
                      message: 'Số điện thoại không hợp lệ',
                    },
                  ]}
                >
                  <FloatInput
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    name="phone_number"
                    getFieldError={getFieldError}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="password"
              className="mb-8"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
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
            <Form.Item
              name="confirmPassword"
              className="mb-6"
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp'));
                  },
                }),
              ]}
            >
              <FloatInput
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
                name="confirmPassword"
                getFieldError={getFieldError}
                password
              />
            </Form.Item>
            <Form.Item valuePropName="checked" noStyle>
              <Checkbox className="mb-3">Chấp nhận tất cả</Checkbox>
              <Link to={PATH.term}>
                <span className="text-[#FF8682]">Điều khoản của chúng tôi</span>
              </Link>
            </Form.Item>
            <Form.Item noStyle>
              <Button
                size={'large'}
                className="bg-[#515DEF] text-white font-normal hover:bg-[#515eef8c]"
                block
                htmlType="submit"
              >
                Đăng ký
              </Button>
            </Form.Item>

            <Flex
              justify="center"
              align="center"
              className="my-3"
              vertical
              gap={12}
            >
              <Typography.Text className="font-semibold">
                Đã có tài khoản?{' '}
                <Link to={PATH.login}>
                  <span className="text-[#FF8682]">Đăng nhập</span>
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

            <LoginOrther />
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

export default RegisterPage;
