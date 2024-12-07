import { useMutation } from '@tanstack/react-query';
import { Flex } from 'antd';
import { AppleIcon, Facebook, GoogleIcon, DlAuthIcon } from 'assets/svgs';
import ButtonCustom from 'components/Button/ButtonCustom';
import { auth, providerFacebook, providerGoogle } from 'configs/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginOrther = () => {
  const { mutate: mutateLoginGoogle, isPending: isPendingLoginGoogle } =
    useMutation({
      mutationFn: () => signInWithPopup(auth, providerGoogle),
      onSuccess: (result: any) => {
        // console.log('result', result.user);
        localStorage.setItem('token', result.user.accessToken);
        window.location.href = '/';
      },
      onError: (error: any) => {
        console.log('Login error: ', error);
      },
    });

  const { mutate: mutateLoginFaceBook, isPending: isPendingLoginFaceBook } =
    useMutation({
      mutationFn: () => signInWithPopup(auth, providerFacebook),
      onSuccess: (result: any) => {
        // console.log('result', result);
        localStorage.setItem('token', result.user.accessToken);
        window.location.href = '/';
      },
      onError: (error: any) => {
        console.log('Login error: ', error);
      },
    });

  const loginWithDlAuth = () => {
    const API_KEY = 'a98fb760-de73-42c0-b015-b2b6098a2a7a';
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const url3Rd = 'https://dl-auth.com';
    const loginUrl = `https://dl-auth.com/login3rd?api_key=${API_KEY}&base_url=${encodeURIComponent(
      baseUrl,
    )}`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      loginUrl,
      'Login',
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    // Lắng nghe kết quả từ popup
    window.addEventListener('message', (event) => {
      if (event.origin === url3Rd) {
        const { token } = event.data;
        localStorage.setItem('token', token);
        window.location.href = '/';
      }
    });
  };
  return (
    <Flex justify="space-between" align="center">
      <ButtonCustom
        icon={<Facebook />}
        onClick={() => mutateLoginFaceBook()}
        htmlType="button"
        size="large"
      />
      <ButtonCustom
        icon={<GoogleIcon />}
        onClick={() => mutateLoginGoogle()}
        htmlType="button"
        size="large"
      />
      <ButtonCustom
        icon={<AppleIcon />}
        onClick={() => mutateLoginGoogle()}
        htmlType="button"
        size="large"
      />
      <ButtonCustom
        icon={<DlAuthIcon style={{ height: '40px', width: '100px' }} />}
        onClick={loginWithDlAuth}
        htmlType="button"
        size="small"
      />
    </Flex>
  );
};

export default LoginOrther;
