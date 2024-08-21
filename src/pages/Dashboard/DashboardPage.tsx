import { auth } from 'configs/firebaseConfig';
import React, { useEffect } from 'react';

const DashboardPage = () => {
  useEffect(() => {
    console.log('auth', auth);
  }, []);
  return <div>DashboardPage New 4</div>;
};

export default DashboardPage;
