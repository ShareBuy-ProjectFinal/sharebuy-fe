import { useMutation } from '@tanstack/react-query';
import { Flex } from 'antd';
import { AppleIcon, Facebook, GoogleIcon } from 'assets/svgs';
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
    </Flex>
  );
};

export default LoginOrther;
