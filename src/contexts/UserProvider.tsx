/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { Spin } from 'antd';
import AuthApi from 'apis/AuthApis';
import { auth } from 'configs/firebaseConfig';
import { IUser } from 'interfaces/User/User';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PATH } from 'routes/Path';

type UserContextValues = {
  user: IUser;
  isLoading: boolean;
  getUser: () => void;
  signOut: () => void;
};

const UserContext = createContext<UserContextValues>(undefined as never);
const useUser = (): UserContextValues => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentUser = auth.currentUser;

  const handleRemoveToken = () => {
    localStorage.removeItem('token');
    setIsLoading(false);
    auth.signOut();
    window.location.href = PATH.login;
  };

  const { mutate: getUser } = useMutation({
    mutationFn: AuthApi.getMe,
    onSuccess: (response) => {
      // console.log('response', response);
      if (response?._id) {
        setUser(response);
        setIsLoading(false);
      } else {
        createUser({
          user_name: currentUser?.displayName,
          full_name: currentUser?.displayName,
          email: currentUser?.email,
          phone_number: currentUser?.phoneNumber,
          role: 'SHOP',
          image: currentUser?.photoURL,
        });
      }
    },
    onError: (error) => {
      console.log('error getMe', error);
      handleRemoveToken();
    },
  });

  const { mutate: createUser } = useMutation({
    mutationFn: AuthApi.createUser,
    onSuccess: (response) => {
      getUser();
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('error createUser', error);
      handleRemoveToken();
    },
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      getUser();
    });

    return () => unsubscribe();
  }, []);

  const signOut = () => {
    handleRemoveToken();
  };

  return (
    <UserContext.Provider value={{ user, getUser, signOut, isLoading }}>
      <Spin className="!max-h-full" size="large" spinning={isLoading}>
        {children}
      </Spin>
    </UserContext.Provider>
  );
};

export { UserProvider, useUser };
