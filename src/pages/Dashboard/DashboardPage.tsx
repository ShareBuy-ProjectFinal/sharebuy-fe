import { auth } from 'configs/firebaseConfig';
import React, { useEffect } from 'react';

const DashboardPage = () => {
  useEffect(() => {
    console.log('auth', auth);
  }, []);
  return <div>DashboardPage</div>;
};

export default DashboardPage;
