import { auth } from 'configs/firebaseConfig';
import React, { useEffect } from 'react';

const DashboardPage = () => {
  useEffect(() => {
    console.log('auth', auth);
  }, []);
  return <div>DashboardPage New 2</div>;
};

export default DashboardPage;
