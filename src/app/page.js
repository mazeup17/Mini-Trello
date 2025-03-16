import React from 'react';
import Dashboard from './components/Dashboard';
import { SessionProvider } from 'next-auth/react';

const Page = () => {
  return <Dashboard />;
};

export default Page;
