import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
  itemsBreadcrumb: BreadcrumbItemType[];
  setBreadcrumb: (items: BreadcrumbItemType[]) => void;
};

const TitleContext = createContext<TitleContextType>(undefined as never);
const useTitle = () => useContext(TitleContext);

const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>('');
  const [itemsBreadcrumb, setBreadcrumb] = useState<BreadcrumbItemType[]>([]);
  return (
    <TitleContext.Provider
      value={{ title, setTitle, itemsBreadcrumb, setBreadcrumb }}
    >
      {children}
    </TitleContext.Provider>
  );
};

export { useTitle, TitleProvider };
