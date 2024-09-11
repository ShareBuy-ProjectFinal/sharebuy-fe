/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { Spin } from 'antd';
import AuthApi from 'apis/AuthApis';
import { IUser } from 'interfaces/User/User';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleRemoveToken = () => {
    localStorage.removeItem('token');
    // window.location.replace(getSignoutUri());
  };

  const { mutate: getUser } = useMutation({
    mutationFn: AuthApi.getMe,
    onSuccess: (response) => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('error', error);
      handleRemoveToken();
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setIsLoading(false);
      return;
    }
    getUser();
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
