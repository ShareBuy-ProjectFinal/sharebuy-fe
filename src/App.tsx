import { Router } from 'routes/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from 'contexts/UserProvider';
import { TitleProvider } from 'contexts/TitleProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TitleProvider>
          <ToastContainer />
          <Router />
        </TitleProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};
export default App;
